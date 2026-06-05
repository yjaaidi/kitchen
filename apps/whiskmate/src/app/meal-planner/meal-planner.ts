import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Recipe } from '../recipe/recipe';
import { reset } from '../shared/shared.actions';

const initialState: MealPlannerState = {
  recipes: [],
};

export interface MealPlannerState {
  recipes: Recipe[];
}

export const mealPlannerSlice = createSlice({
  name: 'mealPlanner',
  initialState,
  reducers: {
    addRecipe(state, action: PayloadAction<Recipe>) {
      const recipe = action.payload;
      if (state.recipes.some((r) => r.id === recipe.id)) {
        throw new Error('Recipe already added');
      }
      return {
        ...state,
        recipes: [...state.recipes, recipe],
      };
    },
    removeRecipe(state, action: PayloadAction<Recipe>) {
      return {
        ...state,
        recipes: state.recipes.filter((r) => r.id !== action.payload.id),
      };
    },
  },
  selectors: {
    selectRecipes: (state) => state.recipes,
    selectCanAddRecipe: (state, recipe: Recipe) =>
      !state.recipes.some((r) => r.id === recipe.id),
  },
  extraReducers: (builder) => {
    builder.addCase(reset, () => mealPlannerSlice.getInitialState());
  },
});

export const { addRecipe, removeRecipe } = mealPlannerSlice.actions;
export const { selectRecipes, selectCanAddRecipe } = mealPlannerSlice.selectors;

export const mealPlannerRootReducer = {
  [mealPlannerSlice.reducerPath]: mealPlannerSlice.reducer,
};
