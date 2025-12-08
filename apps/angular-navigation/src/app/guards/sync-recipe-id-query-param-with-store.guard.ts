import { inject, untracked } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { recipeViewerRouterHelper } from '../recipe-viewer.router-helper';
import { RecipeStore } from '../recipe.store';
import { RedirectHelper } from './redirect-helper';

export const syncRecipeIdQueryParamWithStoreGuard: CanActivateFn = (
  route,
  state,
) => {
  const recipeStore = inject(RecipeStore);
  const redirectHelper = inject(RedirectHelper);
  const recipeIds = route.queryParamMap.getAll('recipe_id');

  /* Route query params => store. */
  if (recipeIds.length > 0) {
    recipeStore.setRecipeIds(recipeIds);
    return true;
  }

  /* Store => route query params.
   * This is needed when user navigates to a route outside this guard's scope,
   * then comes back later in the same session. */
  const selectedRecipeIds = untracked(() => recipeStore.selectedRecipeIds());
  if (selectedRecipeIds.length > 0) {
    const { queryParams } = recipeViewerRouterHelper.route({
      recipeIds: selectedRecipeIds,
    });
    return redirectHelper.createRedirectOverridingQueryParams({
      state,
      queryParams,
    });
  }

  return true;
};
