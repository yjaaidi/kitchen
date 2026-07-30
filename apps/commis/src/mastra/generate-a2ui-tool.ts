import {
  GENERATE_A2UI_ARG_DESCRIPTIONS,
  GENERATE_A2UI_TOOL_NAME,
  RENDER_A2UI_TOOL_DEF,
  buildA2UIEnvelope,
  findPriorSurface,
} from '@ag-ui/a2ui-toolkit';
import { A2UI_RENDER_STREAM_TYPE } from '@ag-ui/mastra';
import { Agent } from '@mastra/core/agent';
import { createTool, type ToolExecutionContext } from '@mastra/core/tools';
import { z } from 'zod';
import { RECIPE_A2UI_CATALOG } from '../a2ui/recipe-catalog';
import { MODEL } from './core';

const RENDER_TOOL_NAME = RENDER_A2UI_TOOL_DEF.function.name;

/** Recipe-shaped data model (Whiskmate surfaces). */
const RecipeItemSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()).optional(),
  instructions: z.string().optional(),
});

/** Structured output for one dynamic A2UI surface composition. */
const A2UI_SURFACE_SCHEMA = z.object({
  surfaceId: z.string().describe('Unique surface identifier.'),
  data: z
    .object({ items: z.array(RecipeItemSchema) })
    .optional()
    .describe(
      'Initial data model at path "/". Use { items: [recipes] } for List path "/items".',
    ),
  components: z
    .array(
      z.discriminatedUnion(
        'component',
        // fromJSONSchema returns ZodType; runtime schemas are discriminable on `component`.
        Object.entries(RECIPE_A2UI_CATALOG.components).map(([name, schema]) =>
          z.fromJSONSchema({
            type: 'object',
            properties: {
              id: { type: 'string' },
              component: { const: name },
              ...schema.properties,
            },
            required: ['id', 'component', ...(schema.required ?? [])],
            additionalProperties: false,
          }),
        ) as never,
      ),
    )
    .describe("A2UI v0.9 component array; root id 'root'."),
});

type A2uiSurfaceArgs = z.infer<typeof A2UI_SURFACE_SCHEMA>;

type A2uiOperationsEnvelope = {
  a2ui_operations: unknown[];
};

function _buildComposePrompt(input: {
  intent?: 'create' | 'update';
  targetSurfaceId?: string;
}): string {
  const catalogId = RECIPE_A2UI_CATALOG.catalogId;
  const isUpdate = input.intent === 'update';

  return `You compose Whiskmate recipe A2UI surfaces.
Return a single structured object with surfaceId, components, and optional data. No prose.

## Fields
- surfaceId: stable hyphenated id (e.g. "favorite-recipes")
- components: flat A2UI v0.9 array; include a root component with id "root".
  Every component needs \`id\` and \`component\` (type name).
  Text components MUST include \`text\` (literal or { "path": "..." }) — variant alone renders blank.
- data: optional initial model at path "/". For recipe lists use { "items": [ { name, ingredients?, instructions? }, ... ] }.

${
  isUpdate
    ? `This is an UPDATE of surface "${input.targetSurfaceId ?? ''}". Reuse that surfaceId. Do not invent a new surface.`
    : `This is a CREATE. Pick a stable surfaceId. The host stamps catalogId "${catalogId}" — you do not pass catalogId.`
}

## Available components
${JSON.stringify(RECIPE_A2UI_CATALOG.components, null, 2)}

## Data rules
- Populate data first.
- Use the user-provided recipe data exactly. Do not invent, omit, or replace items.
- Prefer a List with \`children: { componentId, path: "/items" }\` for repeating recipe cards.
- Bind recipe fields with relative paths (no leading slash), e.g. title Text: { "path": "name" }.
- For a List over string arrays (ingredients), the item template Text must use { "path": "." }.
- Section labels (e.g. "Ingredients") are literal Text strings, not path bindings.
- Put recipes in data.items (never nest as data.items.items).
`;
}

/**
 * Dynamic A2UI composition. Streams `{ a2ui_operations }` as the surface
 * object populates, and emits a synthetic `render_a2ui` tool-result via
 * `writer.custom` so A2UIMiddleware produces ACTIVITY_SNAPSHOT — without
 * registering a real render tool.
 */
export const generateA2uiTool = createTool({
  id: GENERATE_A2UI_TOOL_NAME,
  description:
    'Generate or update a dynamic A2UI surface. When rendering known data (favorite recipes, a composed recipe, etc.), put the FULL payload in `changes` as JSON — this tool cannot see other tool results or working memory. Do not invent data that belongs in `changes`.',
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
        'Data/instructions for A2UI composition. For recipe UIs, pass the complete JSON array/object of recipes (name, ingredients, instructions). Also used for natural-language edits when intent=update.',
      ),
  }),
  execute: async (input, context: ToolExecutionContext) => {
    const changes = input.changes?.trim();
    const isUpdate = input.intent === 'update';
    const targetSurfaceId = input.target_surface_id;

    if (isUpdate && !targetSurfaceId) {
      return {
        error: 'intent=update requires target_surface_id',
      };
    }

    const messages = _stripTrailingGenerateA2uiCall(
      Array.isArray(context.agent?.messages) ? context.agent.messages : [],
    );
    const prior =
      isUpdate && targetSurfaceId
        ? findPriorSurface(messages, targetSurfaceId)
        : undefined;

    const envelope = await _streamA2uiOperations({
      prompt: _buildComposePrompt({
        intent: input.intent,
        targetSurfaceId,
      }),
      changes,
      isUpdate,
      targetSurfaceId,
      prior,
      writer: context.writer,
      tracingContext: context.tracingContext,
      abortSignal: context.abortSignal,
    });

    if (!envelope) {
      return { error: 'Failed to compose A2UI surface' };
    }

    return envelope;
  },
});

/**
 * Stream structured surface args → populate `{ a2ui_operations }` → emit a
 * synthetic `render_a2ui` TOOL_CALL_RESULT for A2UIMiddleware.
 */
async function _streamA2uiOperations(opts: {
  prompt: string;
  changes: string | undefined;
  isUpdate: boolean;
  targetSurfaceId: string | undefined;
  prior: ReturnType<typeof findPriorSurface>;
  writer: ToolExecutionContext['writer'];
  tracingContext: ToolExecutionContext['tracingContext'];
  abortSignal: ToolExecutionContext['abortSignal'];
}): Promise<A2uiOperationsEnvelope | null> {
  const {
    prompt,
    changes,
    isUpdate,
    targetSurfaceId,
    prior,
    writer,
    tracingContext,
    abortSignal,
  } = opts;

  const composer = new Agent({
    id: 'a2ui_composer',
    name: 'a2ui_composer',
    instructions: prompt,
    model: MODEL,
  });

  const toolCallId = `a2ui-render-${Date.now()}`;
  let started = false;
  let lastOpsJson = '';
  let latestEnvelope: A2uiOperationsEnvelope | null = null;

  const emitRenderStart = async () => {
    if (started || !writer?.custom) {
      return;
    }
    started = true;
    await writer.custom({
      type: A2UI_RENDER_STREAM_TYPE,
      payload: {
        phase: 'start',
        toolCallId,
        toolName: RENDER_TOOL_NAME,
      },
    } as Parameters<NonNullable<typeof writer.custom>>[0]);
  };

  const emitRenderEnd = async () => {
    if (!started || !writer?.custom) {
      return;
    }
    started = false;
    await writer.custom({
      type: A2UI_RENDER_STREAM_TYPE,
      payload: { phase: 'end', toolCallId },
    } as Parameters<NonNullable<typeof writer.custom>>[0]);
  };

  /** Synthetic render_a2ui tool-result → MastraAgent TOOL_CALL_RESULT → middleware ACTIVITY_SNAPSHOT. */
  const emitRenderToolResult = async (envelope: A2uiOperationsEnvelope) => {
    const opsJson = JSON.stringify(envelope);
    if (opsJson === lastOpsJson) {
      return;
    }
    lastOpsJson = opsJson;
    latestEnvelope = envelope;

    await emitRenderStart();
    await writer?.custom?.({
      type: 'tool-result',
      payload: {
        toolCallId,
        toolName: RENDER_TOOL_NAME,
        result: envelope,
      },
    } as Parameters<NonNullable<NonNullable<typeof writer>['custom']>>[0]);
  };

  const toEnvelope = (
    surface: Partial<A2uiSurfaceArgs> | A2uiSurfaceArgs,
  ): A2uiOperationsEnvelope | null => {
    if (!Array.isArray(surface.components) || surface.components.length === 0) {
      return null;
    }
    return _maybeParseJson(
      buildA2UIEnvelope({
        args: surface as Record<string, unknown>,
        isUpdate,
        targetSurfaceId,
        prior,
        defaultCatalogId: RECIPE_A2UI_CATALOG.catalogId,
      }),
    ) as A2uiOperationsEnvelope;
  };

  try {
    const stream = await composer.stream(
      [
        {
          role: 'user',
          content: `Compose an A2UI surface for this data exactly. Do not invent, omit, or replace any items:
${changes ?? ''}`,
        },
      ],
      {
        structuredOutput: { schema: A2UI_SURFACE_SCHEMA },
        maxSteps: 1,
        tracingContext,
        abortSignal,
      },
    );

    // Populate `{ a2ui_operations }` as the structured object streams in.
    for await (const partial of stream.objectStream) {
      const envelope = toEnvelope(partial);
      if (envelope) {
        await emitRenderToolResult(envelope);
      }
    }

    const surface = await stream.object;
    if (surface) {
      const envelope = toEnvelope(surface);
      if (envelope) {
        await emitRenderToolResult(envelope);
      }
    }
  } finally {
    await emitRenderEnd();
  }

  return latestEnvelope;
}

/** Drop the in-flight generate_a2ui call from history before prior-surface lookup. */
function _stripTrailingGenerateA2uiCall(messages: unknown[]): unknown[] {
  const last = messages[messages.length - 1] as
    | { role?: string; toolCalls?: Array<{ function?: { name?: string } }> }
    | undefined;
  const toolCalls = last?.toolCalls;
  if (
    last?.role === 'assistant' &&
    Array.isArray(toolCalls) &&
    toolCalls.some((tc) => tc?.function?.name === GENERATE_A2UI_TOOL_NAME)
  ) {
    return messages.slice(0, -1);
  }
  return messages;
}

function _maybeParseJson(envelope: string): unknown {
  try {
    return JSON.parse(envelope);
  } catch {
    return envelope;
  }
}
