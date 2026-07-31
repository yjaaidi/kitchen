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
import { RECIPE_A2UI_CATALOG } from '../a2ui/recipe-catalog';
import { MODEL } from './core';

const RENDER_TOOL_NAME = RENDER_A2UI_TOOL_DEF.function.name;

/** Literal string or `{ path }` data binding. */
const A2UI_PATH_OR_STRING = z.union([
  z.string(),
  z.object({ path: z.string() }),
]);

/**
 * Static child ids, or `{ path, componentId }` template for List repetition.
 * Native Zod unions (→ anyOf) — Gemini rejects nested catalog `oneOf` /
 * open `z.record` tool schemas that `fromJSONSchema` would emit.
 */
const A2UI_CHILD_LIST = z.union([
  z.array(z.string()),
  z.object({
    path: z.string(),
    componentId: z.string(),
  }),
]);

/**
 * Closed per-type component schemas (no open objects). Anthropic and Gemini
 * both reject empty `{}` / open `z.record` parameter schemas; semantic
 * validation still runs via `runA2UIGenerationWithRecovery` + catalog.
 */
const RENDER_A2UI_INPUT_SCHEMA = z.object({
  surfaceId: z.string().describe('Unique surface identifier.'),
  components: z
    .array(
      z.discriminatedUnion('component', [
        z.object({
          id: z.string(),
          component: z.literal('Column'),
          children: A2UI_CHILD_LIST,
        }),
        z.object({
          id: z.string(),
          component: z.literal('Row'),
          children: A2UI_CHILD_LIST,
        }),
        z.object({
          id: z.string(),
          component: z.literal('Card'),
          child: z.string(),
        }),
        z.object({
          id: z.string(),
          component: z.literal('Text'),
          text: A2UI_PATH_OR_STRING,
          variant: z
            .enum(['h1', 'h2', 'h3', 'h4', 'h5', 'caption', 'body'])
            .optional(),
        }),
        z.object({
          id: z.string(),
          component: z.literal('List'),
          children: A2UI_CHILD_LIST,
          direction: z.enum(['vertical', 'horizontal']).optional(),
        }),
        z.object({
          id: z.string(),
          component: z.literal('Divider'),
          axis: z.enum(['horizontal', 'vertical']).optional(),
        }),
      ]),
    )
    .describe("A2UI v0.9 component array; root id 'root'."),
  data: z
    .object({
      items: z.array(
        z.object({
          name: z.string(),
          ingredients: z.array(z.string()).optional(),
          instructions: z.string().optional(),
        }),
      ),
    })
    .optional()
    .describe(
      'Initial data model at path "/". Use { items: [recipes] } for List path "/items".',
    ),
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
        'ag-ui': { a2ui_schema: JSON.stringify(RECIPE_A2UI_CATALOG) },
      },
    });
    if (error) {
      return _maybeParseJson(wrapErrorEnvelope(error));
    }

    const { envelope } = await runA2UIGenerationWithRecovery({
      basePrompt: prompt,
      catalog: RECIPE_A2UI_CATALOG,
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
          defaultCatalogId: RECIPE_A2UI_CATALOG.catalogId,
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
