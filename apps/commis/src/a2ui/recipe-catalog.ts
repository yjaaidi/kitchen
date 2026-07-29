import { A2UIValidationCatalog } from '@ag-ui/a2ui-toolkit';

type A2UICatalog = A2UIValidationCatalog & { catalogId: string };

/**
 * Server-owned A2UI inline catalog: Whiskmate's own simple subset of the
 * basic catalog component vocabulary. Hardcoded into the agent system prompt
 * (via MastraAgent `a2ui` + CopilotRuntime `a2ui.schema`) so the model only
 * composes with components
 * the Whiskmate frontend actually implements.
 */
export const recipeA2uiCatalog: A2UICatalog = {
  /**
   * Whiskmate's own catalog id — NOT the v0.9 basic catalog. The frontend
   * registers its custom `AngularCatalog` under the same id (see
   * `apps/whiskmate/src/app/a2ui/whiskmate-catalog.ts`); the two strings must
   * stay identical for surfaces created here to resolve there.
   */
  catalogId: 'https://whiskmate.dev/a2ui/recipe-catalog-v1.json',
  components: {
    Column: {
      description:
        'Vertical layout container. Use as the root for recipe lists and nest Cards inside.',
      type: 'object',
      properties: {
        children: {
          description: 'Child component ids',
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['children'],
    },
    Row: {
      description: 'Horizontal layout container for side-by-side content.',
      type: 'object',
      properties: {
        children: {
          description: 'Child component ids',
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['children'],
    },
    Card: {
      description:
        'Card container for a single recipe. Put a Column of title, ingredients, and instructions inside.',
      type: 'object',
      properties: {
        child: {
          description: 'Single child component id',
          type: 'string',
        },
      },
      required: ['child'],
    },
    Text: {
      description:
        'Text label or paragraph. Use variant "h2"/"h3" for recipe titles and "body" for instructions.',
      type: 'object',
      properties: {
        text: {
          description: 'Literal string or { path } data binding',
          oneOf: [
            { type: 'string' },
            {
              type: 'object',
              properties: { path: { type: 'string' } },
              required: ['path'],
            },
          ],
        },
        variant: {
          type: 'string',
          enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'caption', 'body'],
        },
      },
      required: ['text'],
    },
    List: {
      description:
        'Bulleted or numbered list. Prefer for ingredient lines via a template child.',
      type: 'object',
      properties: {
        children: {
          description:
            'Static child ids, or { path, componentId } to repeat a template over a data array',
          oneOf: [
            { type: 'array', items: { type: 'string' } },
            {
              type: 'object',
              properties: {
                path: { type: 'string' },
                componentId: { type: 'string' },
              },
              required: ['path', 'componentId'],
            },
          ],
        },
        direction: { type: 'string', enum: ['vertical', 'horizontal'] },
      },
      required: ['children'],
    },
    Divider: {
      description: 'Visual separator between recipe sections.',
      type: 'object',
      properties: {
        axis: { type: 'string', enum: ['horizontal', 'vertical'] },
      },
    },
  },
};
