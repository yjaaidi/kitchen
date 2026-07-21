import {
  BuiltInAgent,
  CopilotRuntime,
  defineTool,
} from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { createServer } from 'node:http';
import { z } from 'zod';

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      model: 'google/gemini-3.5-flash',
      prompt: 'You are a helpful cooking assistant.',
      maxSteps: 5,
      tools: [
        defineTool({
          name: 'get-favorite-recipes',
          description: "Get user's favorite recipes",
          parameters: z.object({}),
          execute: async () => {
            return {
              recipes: ['Burger', 'Pizza', 'Tacos'],
            };
          },
        }),
      ],
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
