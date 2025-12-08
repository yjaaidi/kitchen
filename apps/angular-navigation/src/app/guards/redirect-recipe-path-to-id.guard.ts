import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { RecipeRepository } from '../recipe-repository';
import { RedirectHelper } from './redirect-helper';

export const redirectRecipePathToIdGuard: CanActivateFn = (route, state) => {
  const recipeRepository = inject(RecipeRepository);
  const redirectHelper = inject(RedirectHelper);
  const recipePath = route.queryParamMap.get('recipe_path');

  if (recipePath) {
    return recipeRepository.fetchRecipeByPath(recipePath).pipe(
      map((recipe) => {
        return redirectHelper.createRedirectOverridingQueryParams({
          state,
          queryParams: recipe ? { recipe_id: [recipe.id] } : undefined,
        });
      }),
    );
  }

  return true;
};
