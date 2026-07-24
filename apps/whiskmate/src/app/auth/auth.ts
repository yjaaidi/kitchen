import { effect, inject, Service, signal } from '@angular/core';
import { CopilotKit } from '@copilotkit/angular';

const USER_ID_STORAGE_KEY = 'whiskmate.userId';
const COPILOTKIT_RUNTIME_URL = 'http://localhost:8200/api/copilotkit';

@Service()
export class Auth {
  private readonly _copilotKit = inject(CopilotKit);

  readonly userId = signal<string | null>(
    sessionStorage.getItem(USER_ID_STORAGE_KEY),
  );

  constructor() {
    effect(() => {
      const userId = this.userId();
      if (!userId) {
        return;
      }

      this._applyAuth(userId);
    });
  }

  signIn(username: string) {
    this.userId.set(username.trim());
  }

  private _applyAuth(userId: string) {
    sessionStorage.setItem(USER_ID_STORAGE_KEY, userId);
    this._copilotKit.updateRuntime({
      runtimeUrl: COPILOTKIT_RUNTIME_URL,
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    });
  }
}
