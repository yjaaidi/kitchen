export interface RecipeFilterCriteria {
  keywords?: string;
  maxIngredientCount?: number;
  maxStepCount?: number;
}

export function createRecipeFilterCriteria(
  filter: RecipeFilterCriteria,
): RecipeFilterCriteria {
  return filter;
}
