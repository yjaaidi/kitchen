export interface RecipeFilter {
  keywords?: string;
  maxIngredientCount?: number;
  maxStepCount?: number;
  page?: number;
}

export function createRecipeFilter(
  filter: Partial<RecipeFilter> = {}
): RecipeFilter {
  return {
    keywords: filter.keywords,
    maxIngredientCount: filter.maxIngredientCount,
    maxStepCount: filter.maxStepCount,
    page: filter.page ?? 1, // Default to page 1
  };
}
