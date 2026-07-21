import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideCopilotKit } from '@copilotkit/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideCopilotKit({
      runtimeUrl: 'http://localhost:8200/api/copilotkit',
    }),
  ],
};
