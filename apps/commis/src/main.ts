import {
  BuiltInAgent,
  CopilotRuntime,
  convertMessagesToVercelAISDKMessages,
  convertToolsToVercelAITools,
  resolveModel,
} from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { stepCountIs, streamText, tool } from 'ai';
import { createServer } from 'node:http';
import { z } from 'zod';
import { createAgentFactory } from './create-agent-factory';

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      type: 'custom',
      factory: createAgentFactory(({ input, abortSignal, emitState }) =>
        streamText({
          model: resolveModel('google/gemini-3.1-pro-preview'),
          system: 'You are a helpful cooking assistant.',
          messages: convertMessagesToVercelAISDKMessages(input.messages),
          tools: {
            ...convertToolsToVercelAITools(input.tools),
            'get-favorite-recipes': tool({
              description: "Get user's favorite recipes",
              inputSchema: z.object({}),
              execute: async () => {
                const recipes = input.state.recipes ?? [
                  'Burger',
                  'Pizza',
                  'Sushi',
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
