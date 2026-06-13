export interface RecipeFilter {
  keywords?: string;
  maxIngredientCount?: number;
  maxStepCount?: number;
}

export interface RecipeFilterModel {
  keywords: string;
  maxIngredientCount: number;
  maxStepCount: number;
}

export function createRecipeFilter(filter: RecipeFilter): RecipeFilter {
  return filter;
}

export function toRecipeFilter(model: RecipeFilterModel): RecipeFilter {
  return {
    keywords: model.keywords || undefined,
    maxIngredientCount: model.maxIngredientCount || undefined,
    maxStepCount: model.maxStepCount || undefined,
  };
}

export function createEmptyFilterModel(): RecipeFilterModel {
  return { keywords: '', maxIngredientCount: 0, maxStepCount: 0 };
}
