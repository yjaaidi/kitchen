import { Injectable, Provider } from '@angular/core';
import { RecipeFilter } from './recipe-filter';
import { defer, Observable, of } from 'rxjs';
import { Recipe } from './recipe';
import { RecipeRepository, RecipeRepositoryDef } from './recipe-repository';

@Injectable({
  providedIn: 'root',
})
export class RecipeRepositoryFake implements RecipeRepositoryDef {
  private _recipes: Recipe[] = [];

  search({
    filter,
    offset,
    limit,
  }: {
    filter: RecipeFilter;
    offset: number;
    limit: number;
  }): Observable<{ items: Recipe[]; total: number }> {
    return defer(() => {
      const { keywords, maxIngredientCount, maxStepCount } = filter || {};
      const filtered = this._recipes.filter((recipe) => {
        const conditions = [
          /* Filter by keywords. */
          () => (keywords ? recipe.name.includes(keywords) : true),
          /* Filter by max ingredients. */
          () =>
            maxIngredientCount != null
              ? recipe.ingredients.length <= maxIngredientCount
              : true,
          /* Filter by max steps. */
          () =>
            maxStepCount != null ? recipe.steps.length <= maxStepCount : true,
        ];
        return conditions.every((condition) => condition());
      });
      const total = filtered.length;
      const items = filtered.slice(offset, offset + limit);
      return of({ items, total });
    });
  }

  setRecipes(recipes: Recipe[]) {
    this._recipes = recipes;
  }
}

export function provideRecipeRepositoryFake(): Provider[] {
  return [
    RecipeRepositoryFake,
    {
      provide: RecipeRepository,
      useExisting: RecipeRepositoryFake,
    },
  ];
}
