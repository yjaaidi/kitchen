import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  CopilotChat,
  CopilotKit,
  HumanInTheLoopToolCall,
  HumanInTheLoopToolRenderer,
  injectAgentStore,
  registerHumanInTheLoop,
} from '@copilotkit/angular';
import z from 'zod';
import { Auth } from '../auth/auth';

const THREAD_ID_STORAGE_KEY = 'whiskmate.threadId';

@Component({
  selector: 'wm-chat',
  imports: [CopilotChat],
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
    <copilot-chat [threadId]="threadId() ?? ''" />
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
})
export class Chat {
  private readonly _auth = inject(Auth);
  private readonly _copilotKit = inject(CopilotKit);
  private readonly _store = injectAgentStore('default');

  readonly userId = this._auth.userId;
  readonly threadId = signal<string | null>(
    sessionStorage.getItem(THREAD_ID_STORAGE_KEY),
  );

  protected readonly error = signal<Error | null>(null);

  constructor() {
    registerHumanInTheLoop({
      name: 'add-recipe',
      description:
        'Human-in-the-loop confirmation: present the recipe to the user and wait for them to confirm before adding it to favorites. Do not add the recipe yourself — the UI collects approval.',
      parameters: z.object({ recipe: recipeSchema }),
      component: AddRecipe,
    });

    effect(() => {
      const threadId = this.threadId();
      if (threadId) {
        sessionStorage.setItem(THREAD_ID_STORAGE_KEY, threadId);
      } else {
        sessionStorage.removeItem(THREAD_ID_STORAGE_KEY);
      }
    });

    this._copilotKit.core.subscribe({
      onAgentRunStarted: ({ agent }) => {
        this.error.set(null);
        sessionStorage.setItem(THREAD_ID_STORAGE_KEY, agent.threadId);
      },
      onError: ({ error }) => {
        this.error.set(error);
      },
    });
  }

  protected resetThread() {
    this.threadId.set(crypto.randomUUID());
  }
}

const recipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.string(),
});

type Recipe = z.infer<typeof recipeSchema>;

@Component({
  selector: 'wm-add-recipe',
  template: `
    <h3>{{ recipe()?.name ?? '...' }}</h3>
    <ul>
      @for (ingredient of recipe()?.ingredients ?? []; track ingredient) {
        <li>{{ ingredient }}</li>
      }
    </ul>
    <p>{{ recipe()?.instructions ?? '...' }}</p>
    <button class="validate" (click)="confirm()" [disabled]="!canConfirm()">
      CONFIRM
    </button>
    <button class="cancel" (click)="cancel()">CANCEL</button>
  `,
  styles: `
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
export class AddRecipe implements HumanInTheLoopToolRenderer<AddRecipeArgs> {
  private readonly _store = injectAgentStore('default');
  toolCall = input.required<HumanInTheLoopToolCall<AddRecipeArgs>>();

  recipes = computed(
    () => (this._store().state() as { recipes: Recipe[] })?.recipes ?? [],
  );
  recipe = computed(() => this.toolCall().args.recipe);
  canConfirm = computed(() => {
    return (
      this.recipes()?.every(
        (recipe: Recipe) => recipe.name !== this.recipe()?.name,
      ) ?? true
    );
  });

  confirm() {
    // Favorites are appended on the server when this run resumes — approval only.
    this.toolCall().respond({
      status: 'approved',
    });
  }

  cancel() {
    this.toolCall().respond({
      status: 'rejected',
    });
  }
}

type AddRecipeArgs = { recipe: Recipe };
