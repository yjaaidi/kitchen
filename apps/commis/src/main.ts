import type { Message } from '@ag-ui/client';
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

const ADD_RECIPE_TOOL_NAME = 'add-recipe';

const addRecipeArgsSchema = z.object({ recipe: RECIPE_SCHEMA });

const addRecipeStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

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
          if (!userId) {
            throw unauthorizedResponse();
          }

          // HITL `add-recipe` is frontend-only: on resume, persist approved
          // recipes here (not via client setState / LLM follow-up tools).
          const approvedRecipe = findApprovedAddRecipeAfterLastUserMessage(
            input.messages,
          );
          if (approvedRecipe) {
            emitState({
              recipes: appendFavoriteRecipe(userId, approvedRecipe),
            });
          }

          // `input.context` is intentionally ignored: the A2UI schema and
          // generation guidelines are hardcoded server-side (RECIPE_A2UI_PROMPT),
          // so client-forwarded context can never pollute the system prompt.
          return streamText({
            model: MODEL,
            system: `You are a helpful cooking assistant.
When the user wants to add or create a recipe, call create-recipe, then call add-recipe with its result for confirmation.
Favorites are persisted by the server when the user approves add-recipe — do not invent or rewrite the favorites list yourself.

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
                execute: async () => ({ recipes: getFavoriteRecipes(userId) }),
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

function getFavoriteRecipes(userId: string): Recipe[] {
  const existing = favoriteRecipesByUserId.get(userId);
  if (existing) {
    return existing;
  }

  const seeded = [...DEFAULT_FAVORITES];
  favoriteRecipesByUserId.set(userId, seeded);
  return seeded;
}

function appendFavoriteRecipe(userId: string, recipe: Recipe): Recipe[] {
  const current = getFavoriteRecipes(userId);
  if (current.some((existing) => existing.name === recipe.name)) {
    return current;
  }

  const next = [...current, recipe];
  favoriteRecipesByUserId.set(userId, next);
  return next;
}

/**
 * After HITL `respond()`, the resumed run's messages end with tool results
 * (no new user message). Only those trailing approvals are applied — older
 * approvals before the last user turn are ignored so we do not re-append.
 */
function findApprovedAddRecipeAfterLastUserMessage(
  messages: Message[],
): Recipe | null {
  let lastUserIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === 'user') {
      lastUserIdx = i;
      break;
    }
  }

  const recipesByToolCallId = new Map<string, Recipe>();
  for (const message of messages) {
    if (message.role !== 'assistant' || !message.toolCalls) {
      continue;
    }
    for (const toolCall of message.toolCalls) {
      if (toolCall.function.name !== ADD_RECIPE_TOOL_NAME) {
        continue;
      }
      const parsed = addRecipeArgsSchema.safeParse(
        parseJson(toolCall.function.arguments),
      );
      if (parsed.success) {
        recipesByToolCallId.set(toolCall.id, parsed.data.recipe);
      }
    }
  }

  let approved: Recipe | null = null;
  for (let i = lastUserIdx + 1; i < messages.length; i++) {
    const message = messages[i];
    if (message?.role !== 'tool') {
      continue;
    }

    const recipe = recipesByToolCallId.get(message.toolCallId);
    if (!recipe) {
      continue;
    }

    if (parseAddRecipeStatus(message.content) === 'approved') {
      approved = recipe;
    }
  }

  return approved;
}

/**
 * CopilotKit serializes frontend HITL `respond(value)` as
 * `{ toolCallId, toolName, result: value }` in the tool message content.
 */
function parseAddRecipeStatus(content: string): 'approved' | 'rejected' | null {
  const parsed = parseJson(content);
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const wrapped = parsed as { result?: unknown };
  const candidate = wrapped.result !== undefined ? wrapped.result : parsed;
  const result = addRecipeStatusSchema.safeParse(candidate);
  return result.success ? result.data.status : null;
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
