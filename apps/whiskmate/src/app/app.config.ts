import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideCopilotKit
} from '@copilotkit/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideCopilotKit({
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
      runtimeUrl: 'http://localhost:8200/api/copilotkit',
    }),
  ],
};
