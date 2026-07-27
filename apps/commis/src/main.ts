import {
  BuiltInAgent,
  CopilotRuntime,
  convertMessagesToVercelAISDKMessages,
  convertToolsToVercelAITools,
  InMemoryAgentRunner,
  resolveModel,
} from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { generateText, Output, stepCountIs, streamText, tool } from 'ai';
import { createServer } from 'node:http';
import { z } from 'zod';
import {
  RECIPE_A2UI_CATALOG_ID,
  RECIPE_A2UI_PROMPT,
  recipeA2uiCatalog,
} from './a2ui/recipe-catalog';
import { createAgentFactory } from './create-agent-factory';

const RECIPE_SCHEMA = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.string(),
});

type Recipe = z.infer<typeof RECIPE_SCHEMA>;

const DEFAULT_FAVORITES: Recipe[] = [
  {
    name: 'Pizza',
    ingredients: ['Dough', 'Tomato', 'Cheese'],
    instructions: `\
1. Cook the dough
2. Put the tomato on the dough
3. Put the cheese on the tomato`,
  },
  {
    name: 'Sushi',
    ingredients: ['Rice', 'Fish', 'Seaweed'],
    instructions: `\
1. Cook the rice
2. Put the fish on the rice
3. Put the seaweed on the fish`,
  },
];

const MODEL = resolveModel('google/gemini-3.1-pro-preview');

/** In-memory favorite recipes keyed by authenticated user id. */
const favoriteRecipesByUserId = new Map<string, Recipe[]>();

/** In-memory thread ownership keyed by thread id. */
const threadOwnerByThreadIdMap = new Map<string, string>();

const requestUserIdMap = new WeakMap<Request, string>();

const runtime = new CopilotRuntime({
  runner: new InMemoryAgentRunner(),
  // Server-owned A2UI: the catalog lives here, not on the Angular client.
  // injectA2UITool adds the `render_a2ui` tool to the agent's tool list and
  // the middleware turns its streamed args into a2ui operations.
  a2ui: {
    schema: recipeA2uiCatalog,
    defaultCatalogId: RECIPE_A2UI_CATALOG_ID,
    injectA2UITool: true,
  },
  agents: async ({ request }) => {
    return {
      default: new BuiltInAgent({
        type: 'custom',
        maxSteps: 5,
        factory: createAgentFactory(({ input, abortSignal, emitState }) => {
          const userId = requestUserIdMap.get(request);

          // Keep the in-memory store in sync when the client updates agent state
          // (e.g. after confirming add-recipe in the human-in-the-loop UI).
          if (Array.isArray(input.state?.recipes)) {
            favoriteRecipesByUserId.set(
              userId,
              input.state.recipes as Recipe[],
            );
          }

          // `input.context` is intentionally ignored: the A2UI schema and
          // generation guidelines are hardcoded server-side (RECIPE_A2UI_PROMPT),
          // so client-forwarded context can never pollute the system prompt.
          return streamText({
            model: MODEL,
            system: `You are a helpful cooking assistant.
When the user wants to add or create a recipe, call create-recipe, then call add-recipe with its result for confirmation.

${RECIPE_A2UI_PROMPT}`,
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
                  const recipes = getFavoriteRecipes(
                    userId,
                    input.state?.recipes,
                  );
                  emitState({ recipes });
                  return { recipes };
                },
              }),
            },
            abortSignal,
            stopWhen: stepCountIs(5),
          });
        }),
      }),
    };
  },
});

const port = Number(process.env.PORT ?? 8200);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: '/api/copilotkit',
    cors: true,
    hooks: {
      onRequest: async ({ request }) => {
        requestUserIdMap.set(request, getUserIdFromAuthorization(request));
      },
      onBeforeHandler: async ({ request, route }) => {
        if (route.method === 'cpk-debug-events') {
          return;
        }

        const userId = requestUserIdMap.get(request);
        if (!userId) {
          throw unauthorizedResponse();
        }

        // Local InMemory thread endpoints are not user-scoped — deny them.
        if (route.method.startsWith('threads/')) {
          throw unauthorizedResponse();
        }

        if (route.method === 'info' || route.method === 'transcribe') {
          return;
        }

        // stop (and other path-param routes) expose threadId on the route.
        let threadId = 'threadId' in route ? route.threadId : undefined;

        // run / connect put threadId in the JSON body.
        if (request.method === 'POST') {
          try {
            threadId = (await request.clone().json())?.threadId;
          } catch {
            throw unauthorizedResponse();
          }
        }

        assertThreadOwnership(threadId, userId);
      },
    },
  }),
).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
});

function getUserIdFromAuthorization(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const userId = authHeader.slice('Bearer '.length).trim();
  return userId.length > 0 ? userId : null;
}

function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

function assertThreadOwnership(threadId: string | undefined, userId: string) {
  if (!threadId) {
    console.error('Thread ID is required', { userId });
    throw unauthorizedResponse();
  }

  const ownerId = threadOwnerByThreadIdMap.get(threadId);
  if (ownerId && ownerId !== userId) {
    console.error('Unauthorized request', { userId, threadId });
    throw unauthorizedResponse();
  }

  threadOwnerByThreadIdMap.set(threadId, userId);
}

function getFavoriteRecipes(userId: string, stateRecipes?: unknown): Recipe[] {
  if (Array.isArray(stateRecipes) && stateRecipes.length > 0) {
    favoriteRecipesByUserId.set(userId, stateRecipes as Recipe[]);
  }

  const existing = favoriteRecipesByUserId.get(userId);
  if (existing) {
    return existing;
  }

  const seeded = [...DEFAULT_FAVORITES];
  favoriteRecipesByUserId.set(userId, seeded);
  return seeded;
}
