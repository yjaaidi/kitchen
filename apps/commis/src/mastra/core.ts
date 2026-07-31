import { ModelRouterModelId } from '@mastra/core/llm';
import { z } from 'zod';

export const RECIPE_SCHEMA = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.string(),
});

export type Recipe = z.infer<typeof RECIPE_SCHEMA>;

export const DEFAULT_FAVORITES: Recipe[] = [
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

export const MODEL: ModelRouterModelId = 'google/gemini-3.6-flash';
