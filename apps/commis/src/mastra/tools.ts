import { Agent } from '@mastra/core/agent';
import type { MastraMemory } from '@mastra/core/memory';
import { createTool, type ToolExecutionContext } from '@mastra/core/tools';
import { z } from 'zod';
import { DEFAULT_FAVORITES, MODEL, RECIPE_SCHEMA, type Recipe } from './core';

export const COOKING_AGENT_STATE_SCHEMA = z.object({
  favoriteRecipes: z.array(RECIPE_SCHEMA),
});

export type CookingAgentState = z.infer<typeof COOKING_AGENT_STATE_SCHEMA>;

type CookingAgentExecutionContext = ToolExecutionContext & {
  memory?: MastraMemory;
};

type AddRecipeContext = ToolExecutionContext<
  { recipe: Recipe },
  { status: 'approved' | 'rejected' }
> & {
  memory?: MastraMemory;
};

const recipeComposer = new Agent({
  id: 'recipe-composer',
  name: 'Recipe Composer',
  instructions: `You invent realistic home-cooking recipes.
Given only a dish name, produce a complete recipe with a clear name,
an ingredient list that includes quantities, and numbered step-by-step
instructions. Do not ask clarifying questions.`,
  model: MODEL,
});

export const createRecipeTool = createTool({
  id: 'create-recipe',
  description:
    'Compose a full recipe (ingredients + steps) from a dish name or partial details',
  inputSchema: z.object({
    name: z.string().describe('Dish name or short description'),
  }),
  execute: async ({ name }, context) => {
    const result = await recipeComposer.generate(
      `Create a recipe for: ${name}`,
      {
        structuredOutput: { schema: RECIPE_SCHEMA },
        abortSignal: context.abortSignal,
      },
    );
    return { recipe: result.object };
  },
});

export const getFavoriteRecipesTool = createTool({
  id: 'get-favorite-recipes',
  description: "Get user's favorite recipes",
  inputSchema: z.object({}),
  outputSchema: z.object({
    favoriteRecipes: z.array(RECIPE_SCHEMA),
  }),
  execute: async (_input, context: CookingAgentExecutionContext) => {
    const state = await _getCookingAgentState(context);

    const favoriteRecipes = state?.favoriteRecipes ?? DEFAULT_FAVORITES;

    if (!state?.favoriteRecipes) {
      context.memory?.updateWorkingMemory({
        resourceId: context.agent?.resourceId,
        threadId: context.agent?.threadId,
        workingMemory: JSON.stringify(
          COOKING_AGENT_STATE_SCHEMA.parse({
            favoriteRecipes,
          }),
        ),
      });
    }

    return { favoriteRecipes };
  },
});

export const addRecipeTool = createTool({
  id: 'add-recipe',
  description:
    'Human-in-the-loop confirmation: present the recipe to the user and wait for them to confirm before adding it to favorites. Do not add the recipe yourself — the UI collects approval.',
  inputSchema: z.object({
    recipe: RECIPE_SCHEMA,
  }),
  suspendSchema: z.object({
    recipe: RECIPE_SCHEMA,
  }),
  resumeSchema: z.object({
    status: z.enum(['approved', 'rejected']),
  }),
  execute: async ({ recipe }, context: AddRecipeContext) => {
    const { resumeData, suspend } = context.agent ?? {};

    if (!resumeData) {
      return suspend?.({ recipe });
    }

    if (resumeData.status !== 'approved') {
      return { status: 'rejected' as const };
    }

    const state = await _getCookingAgentState(context);
    const current = state?.favoriteRecipes ?? [...DEFAULT_FAVORITES];
    const favoriteRecipes = current.some(
      (existing) => existing.name === recipe.name,
    )
      ? current
      : [...current, recipe];

    const memory = context.memory;
    const threadId = context.agent?.threadId;
    const resourceId = context.agent?.resourceId;

    if (memory && threadId && resourceId) {
      await memory.updateWorkingMemory({
        threadId,
        resourceId,
        workingMemory: JSON.stringify(
          COOKING_AGENT_STATE_SCHEMA.parse({ favoriteRecipes }),
        ),
      });
    }

    return { status: 'approved' as const, favoriteRecipes };
  },
});

async function _getCookingAgentState(
  context: CookingAgentExecutionContext,
): Promise<CookingAgentState | null> {
  const memory = context.memory;
  const threadId = context.agent?.threadId;
  const resourceId = context.agent?.resourceId;

  if (!memory || !threadId || !resourceId) {
    return null;
  }

  const raw = await memory.getWorkingMemory({ threadId, resourceId });
  if (!raw) {
    return null;
  }

  try {
    const parsed = COOKING_AGENT_STATE_SCHEMA.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
