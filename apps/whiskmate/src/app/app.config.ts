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
          handler: async (_, { agent }) => {
            const addedRecipe = prompt('Recipe name');
            const recipes = [...(agent.state.recipes ?? []), addedRecipe];
            agent.setState({
              ...agent.state,
              recipes,
            });
            return {
              addedRecipe,
            };
          },
        },
      ],
    }),
  ],
};
