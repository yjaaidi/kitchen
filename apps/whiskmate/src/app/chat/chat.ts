import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  CopilotChat,
  CopilotKit,
  injectAgentStore,
  injectChatConfiguration,
  injectInterrupt,
  provideCopilotChatConfiguration,
} from '@copilotkit/angular';
import { Auth } from '../auth/auth';

const THREAD_ID_STORAGE_KEY = 'whiskmate.threadId';

type Recipe = {
  name: string;
  ingredients: string[];
  instructions: string;
};

type AgentState = {
  favoriteRecipes?: Recipe[];
};

type MastraSuspendValue = {
  type?: string;
  toolName?: string;
  suspendPayload?: {
    recipe?: Recipe;
  };
  args?: {
    recipe?: Recipe;
  };
};

@Component({
  selector: 'wm-add-recipe',
  template: `
    <h3>{{ recipe().name }}</h3>
    <ul>
      @for (ingredient of recipe().ingredients; track ingredient) {
        <li>{{ ingredient }}</li>
      }
    </ul>
    <p>{{ recipe().instructions }}</p>
    <button class="validate" (click)="confirm()" [disabled]="!canConfirm()">
      CONFIRM
    </button>
    <button class="cancel" (click)="cancel()">CANCEL</button>
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
      border-bottom: 1px solid rgb(0 0 0 / 8%);
      background: #fff;
    }

    button {
      appearance: none;
      border: none;
      border-radius: 0.625rem;
      padding: 0.55rem 1.1rem;
      font:
        600 0.8125rem/1.2 system-ui,
        sans-serif;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition:
        background-color 160ms ease,
        box-shadow 160ms ease,
        transform 120ms ease,
        opacity 160ms ease;
    }

    button:active:not(:disabled) {
      transform: translateY(1px);
    }

    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .validate {
      margin-right: 0.5rem;
      background: linear-gradient(180deg, #2f9d6a 0%, #248558 100%);
      color: #fff;
      box-shadow:
        0 1px 0 rgb(255 255 255 / 18%) inset,
        0 1px 2px rgb(20 80 50 / 28%);
    }

    .validate:hover:not(:disabled) {
      background: linear-gradient(180deg, #34ad74 0%, #279160 100%);
      box-shadow:
        0 1px 0 rgb(255 255 255 / 22%) inset,
        0 4px 12px rgb(36 133 88 / 32%);
    }

    .cancel {
      background: #f4f1ef;
      color: #8a3b3b;
      box-shadow: inset 0 0 0 1px rgb(138 59 59 / 18%);
    }

    .cancel:hover {
      background: #f8e9e8;
      color: #7a2f2f;
      box-shadow: inset 0 0 0 1px rgb(122 47 47 / 28%);
    }
  `,
})
export class AddRecipe {
  readonly recipe = input.required<Recipe>();
  readonly approved = output<void>();
  readonly rejected = output<void>();

  canConfirm = signal(true);

  confirm() {
    this.canConfirm.set(false);
    this.approved.emit();
  }

  cancel() {
    this.rejected.emit();
  }
}

@Component({
  selector: 'wm-chat',
  imports: [CopilotChat, AddRecipe],
  template: `
    <header class="toolbar">
      <span class="user">Signed in as {{ userId() }}</span>
      <button type="button" class="reset" (click)="resetThread()">
        Reset conversation
      </button>
    </header>
    @if (error()) {
      <div class="error">
        <p>{{ error()?.message }}</p>
      </div>
    }
    @if (pendingRecipe(); as recipe) {
      <wm-add-recipe
        [recipe]="recipe"
        (approved)="approveRecipe()"
        (rejected)="rejectRecipe()"
      />
    }
    <copilot-chat />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgb(0 0 0 / 8%);
      background: #faf8f6;
    }

    .user {
      font:
        600 0.8125rem/1.2 system-ui,
        sans-serif;
      letter-spacing: 0.04em;
      color: #6b5b55;
    }

    .reset {
      appearance: none;
      border: none;
      border-radius: 0.625rem;
      padding: 0.55rem 1.1rem;
      font:
        600 0.8125rem/1.2 system-ui,
        sans-serif;
      letter-spacing: 0.04em;
      cursor: pointer;
      background: #f4f1ef;
      color: #8a3b3b;
      box-shadow: inset 0 0 0 1px rgb(138 59 59 / 18%);
      transition:
        background-color 160ms ease,
        box-shadow 160ms ease,
        transform 120ms ease;
    }

    .reset:hover {
      background: #f8e9e8;
      color: #7a2f2f;
      box-shadow: inset 0 0 0 1px rgb(122 47 47 / 28%);
    }

    .reset:active {
      transform: translateY(1px);
    }

    copilot-chat {
      min-height: 0;
    }
  `,
  providers: [
    provideCopilotChatConfiguration({
      agentId: 'default',
    }),
  ],
})
export class Chat {
  private readonly _auth = inject(Auth);
  private readonly _copilotKit = inject(CopilotKit);
  private readonly _chatConfig = injectChatConfiguration();
  private readonly _store = injectAgentStore('default');
  private readonly _interrupt = injectInterrupt({
    agentId: 'default',
    // Only `add-recipe` suspends today; accept legacy mastra_suspend payloads
    // and standard interrupts that carry a recipe.
    enabled: (event) => {
      const parsed = parseMastraSuspend(event.value);
      return (
        parsed?.toolName === 'add-recipe' ||
        event.name === 'on_interrupt' ||
        !!parsed?.recipe
      );
    },
  });

  readonly userId = this._auth.userId;

  /** Favorites mirrored from Mastra working memory via AG-UI shared state. */
  readonly favoriteRecipes = computed(() => {
    const state = this._store().state() as AgentState | null | undefined;
    return state?.favoriteRecipes ?? [];
  });

  protected readonly error = signal<Error | null>(null);

  protected readonly pendingRecipe = computed(() => {
    if (!this._interrupt.hasInterrupt()) {
      return null;
    }
    return (
      parseMastraSuspend(this._interrupt.interrupt()?.metadata)?.recipe ?? null
    );
  });

  constructor() {
    const stored = sessionStorage.getItem(THREAD_ID_STORAGE_KEY);
    if (stored) {
      this._chatConfig.setActiveThreadId(stored, { explicit: true });
    }

    this._copilotKit.core.subscribe({
      onAgentRunStarted: ({ agent }) => {
        this.error.set(null);
        sessionStorage.setItem(THREAD_ID_STORAGE_KEY, agent.threadId);
        // NOT SURE IF THIS IS NEEDED, LET'S COMMENT IT OUT FOR NOW
        // this._interrupt.setThreadId(agent.threadId);
      },
      onError: ({ error }) => {
        this.error.set(error);
      },
    });
  }

  protected async resetThread() {
    sessionStorage.removeItem(THREAD_ID_STORAGE_KEY);
    this.error.set(null);
    this._chatConfig.startNewThread();
    this._interrupt.setThreadId(this._chatConfig.threadId());

    const agent = this._store().agent;
    await agent.detachActiveRun();
    try {
      agent.abortRun();
    } catch {
      // Aborting can cause a 401 when calling /stop
    }
  }

  protected approveRecipe() {
    void this._interrupt.resolve({ status: 'approved' }).catch(() => undefined);
  }

  protected rejectRecipe() {
    void this._interrupt.resolve({ status: 'rejected' }).catch(() => undefined);
  }
}

function parseMastraSuspend(
  value: unknown,
): { toolName?: string; recipe?: Recipe } | null {
  const parsed = coerceJson(value);
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const suspend = parsed as MastraSuspendValue;
  const recipe =
    suspend.suspendPayload?.recipe ??
    suspend.args?.recipe ??
    (parsed as { recipe?: Recipe }).recipe;

  return {
    toolName: suspend.toolName,
    recipe,
  };
}

function coerceJson(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return value;
}
