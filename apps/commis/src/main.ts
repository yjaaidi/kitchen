import {
  BuiltInAgent,
  CopilotRuntime,
  convertMessagesToVercelAISDKMessages,
  convertToolsToVercelAITools,
  resolveModel,
} from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { generateText, Output, stepCountIs, streamText, tool } from 'ai';
import { createServer } from 'node:http';
import { z } from 'zod';
import { createAgentFactory } from './create-agent-factory';

const RECIPE_SCHEMA = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.string(),
});

const MODEL = resolveModel('google/gemini-3.1-pro-preview');

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      type: 'custom',
      factory: createAgentFactory(({ input, abortSignal, emitState }) =>
        streamText({
          model: MODEL,
          system: `You are a helpful cooking assistant.
When the user wants to add or create a recipe, call create-recipe, then call add-recipe with its result for confirmation.`,
          messages: convertMessagesToVercelAISDKMessages(input.messages),
          tools: {
            ...convertToolsToVercelAITools(input.tools),
            'create-recipe': tool({
              description:
                'Compose a full recipe (ingredients + steps) from a dish name or partial details',
              inputSchema: z.object({
                name: z.string().describe('Dish name or short description'),
              }),
              execute: async ({ name }) => {
                const { output: recipe } = await generateText({
                  model: MODEL,
                  output: Output.object({
                    name: 'recipe',
                    schema: RECIPE_SCHEMA,
                  }),
                  system: `You invent realistic home-cooking recipes.
Given only a dish name, produce a complete recipe with a clear name,
an ingredient list that includes quantities, and numbered step-by-step
instructions. Do not ask clarifying questions.`,
                  prompt: `Create a recipe for: ${name}`,
                  abortSignal,
                });
                return { recipe };
              },
            }),
            'get-favorite-recipes': tool({
              description: "Get user's favorite recipes",
              inputSchema: z.object({}),
              execute: async () => {
                const recipes = input.state.recipes ?? [
                  {
                    name: 'Pizza',
                    ingredients: ['Dough', 'Tomato', 'Cheese'],
                    instructions:
                      '1. Cook the dough 2. Put the tomato on the dough 3. Put the cheese on the tomato',
                  },
                  {
                    name: 'Sushi',
                    ingredients: ['Rice', 'Fish', 'Seaweed'],
                    instructions:
                      '1. Cook the rice 2. Put the fish on the rice 3. Put the seaweed on the fish',
                  },
                ];
                emitState({ recipes });
                return { recipes };
              },
            }),
          },
          abortSignal,
          stopWhen: stepCountIs(5),
        }),
      ),
    }),
  },
});

const port = Number(process.env.PORT ?? 8200);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: '/api/copilotkit',
    cors: true,
  }),
).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
});
