import {
  GENERATE_A2UI_ARG_DESCRIPTIONS,
  GENERATE_A2UI_TOOL_NAME,
  RENDER_A2UI_TOOL_DEF,
  buildA2UIEnvelope,
  prepareA2UIRequest,
  runA2UIGenerationWithRecovery,
  wrapErrorEnvelope,
} from '@ag-ui/a2ui-toolkit';
import { Agent } from '@mastra/core/agent';
import { createTool, type ToolExecutionContext } from '@mastra/core/tools';
import { z } from 'zod';
import { recipeA2uiCatalog } from '../a2ui/recipe-catalog';
import { MODEL } from './core';

const RENDER_TOOL_NAME = RENDER_A2UI_TOOL_DEF.function.name;

const RENDER_A2UI_INPUT_SCHEMA = z.object({
  surfaceId: z.string().describe('Unique surface identifier.'),
  components: z
    .array(z.record(z.string(), z.unknown()))
    .describe("A2UI v0.9 component array; root id 'root'."),
  data: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Optional initial data model for the surface.'),
});

/**
 * Toolkit recovery + Mastra render subagent. Forwards tracingContext so Studio
 * nests render spans under this tool. Injects `changes` on create (toolkit
 * only embeds them for intent=update).
 */
export const generateA2uiTool = createTool({
  id: GENERATE_A2UI_TOOL_NAME,
  description:
    'Generate or update a dynamic A2UI surface. When rendering known data (favorite recipes, a composed recipe, etc.), put the FULL payload in `changes` as JSON — the render subagent cannot see tool results or working memory. Do not invent data that belongs in `changes`.',
  inputSchema: z.object({
    intent: z
      .enum(['create', 'update'])
      .optional()
      .describe(GENERATE_A2UI_ARG_DESCRIPTIONS.intent),
    target_surface_id: z
      .string()
      .optional()
      .describe(GENERATE_A2UI_ARG_DESCRIPTIONS.target_surface_id),
    changes: z
      .string()
      .optional()
      .describe(
        'Data/instructions for the render subagent. For recipe UIs, pass the complete JSON array/object of recipes (name, ingredients, instructions). Also used for natural-language edits when intent=update.',
      ),
  }),
  execute: async (input, context: ToolExecutionContext) => {
    const changes = input.changes?.trim();

    // Local catalog → Available Components in the subagent prompt
    // (prepareA2UIRequest → buildSubagentPrompt → buildContextPrompt).
    const { prompt, isUpdate, prior, error } = prepareA2UIRequest({
      intent: input.intent,
      targetSurfaceId: input.target_surface_id,
      changes: input.changes,
      messages: [],
      state: {
        'ag-ui': { a2ui_schema: JSON.stringify(recipeA2uiCatalog) },
      },
    });
    if (error) {
      return _maybeParseJson(wrapErrorEnvelope(error));
    }

    const { envelope } = await runA2UIGenerationWithRecovery({
      basePrompt: prompt,
      catalog: recipeA2uiCatalog,
      invokeSubagent: async (subagentPrompt) => {
        let result: z.infer<typeof RENDER_A2UI_INPUT_SCHEMA> | null = null;

        const renderTool = createTool({
          id: RENDER_TOOL_NAME,
          description: RENDER_A2UI_TOOL_DEF.function.description,
          inputSchema: RENDER_A2UI_INPUT_SCHEMA,
          execute: async (toolInput) => {
            result = toolInput;
            return 'ok';
          },
        });

        const subagent = new Agent({
          id: 'a2ui_render_subagent',
          name: 'a2ui_render_subagent',
          instructions: subagentPrompt,
          model: MODEL,
          tools: { [RENDER_TOOL_NAME]: renderTool },
        });

        await subagent.generate(
          [
            {
              role: 'user',
              content: `Render this data exactly in the A2UI surface. Do not invent, omit, or replace any items:
  ${changes}`,
            },
          ],
          {
            toolChoice: { type: 'tool', toolName: RENDER_TOOL_NAME },
            maxSteps: 1,
            tracingContext: context.tracingContext,
          },
        );

        return result;
      },
      buildEnvelope: (renderArgs) =>
        buildA2UIEnvelope({
          args: renderArgs,
          isUpdate,
          targetSurfaceId: input.target_surface_id,
          prior,
          defaultCatalogId: recipeA2uiCatalog.catalogId,
        }),
    });

    return _maybeParseJson(envelope);
  },
});

function _maybeParseJson(envelope: string): unknown {
  try {
    return JSON.parse(envelope);
  } catch {
    return envelope;
  }
}
