import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecipeStore } from './recipe.store';

export const bindRecipeIdQueryParamToStore: ResolveFn<void> = (route) => {
  const recipeStore = inject(RecipeStore);
  const recipeIds = route.queryParamMap.getAll('recipe_id');
  recipeStore.setRecipeIds(recipeIds);
};
