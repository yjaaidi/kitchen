export interface RecipeFilterCriteria {
  keywords?: string;
  maxIngredients?: number;
  maxSteps?: number;
}
export function createRecipeFilterCriteria(
  criteria: RecipeFilterCriteria
): RecipeFilterCriteria {
  return criteria;
}
