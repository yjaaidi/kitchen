import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { MODEL } from './core';
import { generateA2uiTool } from './generate-a2ui-tool';
import {
  addRecipeTool,
  COOKING_AGENT_STATE_SCHEMA,
  createRecipeTool,
  getFavoriteRecipesTool,
} from './tools';

export const cookingAgent = new Agent({
  id: 'default',
  name: 'default',
  instructions: `You are a helpful cooking assistant.
- When the user wants to add or create a recipe, call create-recipe, then call add-recipe with its result for confirmation.
- Favorites are persisted by the server when the user approves add-recipe — do not invent or rewrite the favorites list yourself.
- Use generate_a2ui to render recipes (do not dump recipe lists as markdown/chat text when A2UI is available).
- The A2UI subagent cannot see tool results or working memory. After get-favorite-recipes (or create-recipe), call generate_a2ui with intent "create" and put the FULL recipe payload in the changes argument as JSON (name, ingredients, instructions for each recipe). Never invent recipes in changes — copy the tool result exactly.
- Do not repeat that recipe data in assistant text; pass it only via generate_a2ui changes.
`,
  model: MODEL,
  tools: {
    'create-recipe': createRecipeTool,
    'get-favorite-recipes': getFavoriteRecipesTool,
    'add-recipe': addRecipeTool,
    generate_a2ui: generateA2uiTool,
  },
  memory: new Memory({
    options: {
      workingMemory: {
        enabled: true,
        agentManaged: false,
        scope: 'thread',
        schema: COOKING_AGENT_STATE_SCHEMA,
      },
    },
  }),
  defaultOptions: {
    maxSteps: 5,
  },
});
