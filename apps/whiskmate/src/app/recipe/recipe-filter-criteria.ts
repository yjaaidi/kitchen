export interface RecipeFilterCriteria {
  keywords?: string;
}

export function createRecipeFilterCriteria(
  criteria: RecipeFilterCriteria,
): RecipeFilterCriteria {
  return criteria;
}
