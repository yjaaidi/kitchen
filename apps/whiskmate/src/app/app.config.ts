import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideCopilotKit } from '@copilotkit/angular';
import { z } from 'zod';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideCopilotKit({
      runtimeUrl: 'http://localhost:8200/api/copilotkit',
      frontendTools: [
        {
          name: 'add-recipe',
          description: 'Add recipe to favorites',
          parameters: z.object({}),
          handler: async () => {
            return {
              recipes: [prompt('Recipe name')],
            };
          },
        },
      ],
    }),
  ],
};
