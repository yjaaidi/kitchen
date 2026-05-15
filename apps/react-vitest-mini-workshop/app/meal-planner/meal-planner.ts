import { create, StateCreator } from 'zustand';
import type { Recipe } from '../recipe/recipe';

const initialState: State = {
  recipes: [] as Recipe[],
};

export const stateCreator: StateCreator<MealPlannerStore> = (set, get) => ({
  ...initialState,
  addRecipe(recipe) {
    const { recipes } = get();
    if (recipes.some((r) => r.id === recipe.id)) {
      throw new Error('Recipe already added');
    }
    set({ recipes: [...recipes, recipe] });
  },
  canAddRecipe(recipe) {
    const { recipes } = get();
    return !recipes.some((r) => r.id === recipe.id);
  },
  removeRecipe(recipe) {
    const { recipes } = get();
    set({ recipes: recipes.filter((r) => r.id !== recipe.id) });
  },
});

export const useMealPlannerStore = create(stateCreator);

interface State {
  recipes: Recipe[];
}

interface Actions {
  addRecipe: (recipe: Recipe) => void;
  canAddRecipe: (recipe: Recipe) => boolean;
  removeRecipe: (recipe: Recipe) => void;
}

type MealPlannerStore = State & Actions;
