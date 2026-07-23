import { EventType, type BaseEvent, type StateDeltaEvent } from '@ag-ui/core';
import {
  BuiltInAgent,
  CopilotRuntime,
  convertAISDKStream,
  convertMessagesToVercelAISDKMessages,
  convertToolsToVercelAITools,
  resolveModel,
} from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { stepCountIs, streamText, tool } from 'ai';
import { compare } from 'fast-json-patch';
import { createServer } from 'node:http';
import { z } from 'zod';

const GET_FAVORITE_RECIPES_TOOL = 'get-favorite-recipes';
const model = resolveModel('google/gemini-3.1-pro-preview');

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      type: 'custom',
      factory: async function* ({
        input,
        abortSignal,
      }): AsyncGenerator<BaseEvent> {
        const pendingStateChanges: StateDeltaEvent[] = [];

        const result = streamText({
          model,
          system: 'You are a helpful cooking assistant.',
          messages: convertMessagesToVercelAISDKMessages(input.messages),
          tools: {
            ...convertToolsToVercelAITools(input.tools),
            [GET_FAVORITE_RECIPES_TOOL]: tool({
              description: "Get user's favorite recipes",
              inputSchema: z.object({}),
              execute: async () => {
                const recipes = input.state.recipes ?? [
                  'Burger',
                  'Pizza',
                  'Sushi',
                ];
                pendingStateChanges.push({
                  type: EventType.STATE_DELTA,
                  delta: compare(input.state, { ...input.state, recipes }),
                });
                return { recipes };
              },
            }),
          },
          abortSignal,
          stopWhen: stepCountIs(5),
        });

        for await (const event of convertAISDKStream(
          result.fullStream,
          abortSignal,
        )) {
          yield event;
        }

        for (const change of pendingStateChanges) {
          yield change;
        }
      },
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
