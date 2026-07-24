import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCopilotKit } from '@copilotkit/angular';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideCopilotKit({
      // runtimeUrl is set after sign-in via CopilotKit.updateRuntime so the
      // initial /info handshake always includes the Authorization header.
      suggestionsConfig: [
        {
          suggestions: [
            {
              title: 'Add recipe',
              message: 'Add a recipe to my favorites',
            },
            {
              title: 'View recipes',
              message: 'View my favorite recipes',
            },
          ],
        },
      ],
    }),
  ],
};
