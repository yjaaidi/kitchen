import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RedirectCommand,
  Router,
} from '@angular/router';
import { RecipeRepository } from './recipe-repository';
import { map } from 'rxjs';

export const redirectRecipePathToIdGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const router = inject(Router);
  const recipeRepository = inject(RecipeRepository);

  const recipePath = route.queryParamMap.get('recipe_path');
  if (recipePath) {
    return recipeRepository.fetchRecipeByPath(recipePath).pipe(
      map((recipe) => {
        const url = router.createUrlTree(['/viewer'], {
          queryParams: recipe ? { recipe_id: [recipe.id] } : null,
        });

        return new RedirectCommand(url);
      }),
    );
  }

  return true;
};
