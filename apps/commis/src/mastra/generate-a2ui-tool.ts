import { getA2UITools } from '@ag-ui/mastra/a2ui';
import { createTool, type ToolExecutionContext } from '@mastra/core/tools';
import { z } from 'zod';
import { recipeA2uiCatalog } from '../a2ui/recipe-catalog';
import { MODEL } from './core';

/**
 * Stock generate_a2ui only forwards `changes` into the subagent prompt on
 * intent=update. For create (our usual path), inject the payload as a synthetic
 * user message so the render subagent can see recipe data without dumping it
 * into assistant chat text.
 */
const baseGenerateA2ui = getA2UITools({
  model: MODEL,
  catalog: recipeA2uiCatalog,
  defaultCatalogId: recipeA2uiCatalog.catalogId,
});

export const generateA2uiTool = createTool({
  id: 'generate_a2ui',
  description:
    'Generate or update a dynamic A2UI surface. When rendering known data (favorite recipes, a composed recipe, etc.), put the FULL payload in `changes` as JSON — the render subagent cannot see tool results or working memory. Do not invent data that belongs in `changes`.',
  inputSchema: z.object({
    intent: z
      .enum(['create', 'update'])
      .optional()
      .describe(
        "'create' for a new surface (default); 'update' to modify a prior surface.",
      ),
    target_surface_id: z
      .string()
      .optional()
      .describe("Required when intent='update'. Prior surface id to modify."),
    changes: z
      .string()
      .optional()
      .describe(
        'Data/instructions for the render subagent. For recipe UIs, pass the complete JSON array/object of recipes (name, ingredients, instructions). Also used for natural-language edits when intent=update.',
      ),
  }),
  execute: async (input, context: ToolExecutionContext) => {
    const changes = input.changes?.trim();
    if (changes && context.agent?.messages) {
      context.agent.messages = [
        ...context.agent.messages,
        {
          role: 'user',
          content: `Render this data exactly in the A2UI surface. Do not invent, omit, or replace any items:\n${changes}`,
        },
      ];
    }

    return baseGenerateA2ui.execute!(input, context);
  },
});
