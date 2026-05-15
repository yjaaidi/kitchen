import { create } from 'zustand';
import type { Recipe } from '../recipe/recipe';

type MealPlannerState = {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipe: Recipe) => void;
  canAddRecipe: (recipe: Recipe) => boolean;
};

const initialState = {
  recipes: [] as Recipe[],
};

export const useMealPlannerStore = create<MealPlannerState>((set, get) => ({
  ...initialState,
  addRecipe(recipe) {
    if (get().recipes.some((r) => r.id === recipe.id)) {
      throw new Error('Recipe already added');
    }
    set({ recipes: [...get().recipes, recipe] });
  },
  canAddRecipe(recipe) {
    return !get().recipes.some((r) => r.id === recipe.id);
  },
  removeRecipe(recipe) {
    set({ recipes: get().recipes.filter((r) => r.id !== recipe.id) });
  },
}));

export function resetMealPlannerStore(): void {
  useMealPlannerStore.setState(initialState);
}
