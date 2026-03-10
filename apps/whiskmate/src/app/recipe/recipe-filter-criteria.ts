export interface RecipeFilterCriteria {
  keywords: string;
  maxIngredientCount: number | null;
  maxStepCount: number | null;
}

export function createDefaultRecipeFilterCriteria(): RecipeFilterCriteria {
  return {
    keywords: '',
    maxIngredientCount: null,
    maxStepCount: null,
  };
}

export function createRecipeFilterCriteria(
  filter: RecipeFilterCriteria,
): RecipeFilterCriteria {
  return filter;
}
