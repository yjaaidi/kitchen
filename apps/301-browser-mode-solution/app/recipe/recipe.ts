export interface Recipe {
  id: string;
  description: string | null;
  ingredients: Ingredient[];
  name: string;
  pictureUri: string;
  steps: string[];
}

export interface Ingredient {
  quantity?: Quantity;
  name: string;
}

export interface Quantity {
  amount: number;
  unit: string;
}

export function createRecipe(recipe: Recipe): Recipe {
  return recipe;
}
