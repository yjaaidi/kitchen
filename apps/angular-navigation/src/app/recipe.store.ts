import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RecipeRepository } from './recipe-repository';
import { combineLatest, map } from 'rxjs';

/**
 * @todo use `@ngrx/signal-store`.
 */
@Injectable({ providedIn: 'root' })
export class RecipeStore {
  private _recipeIds = signal<string[]>([]);
  private _repository = inject(RecipeRepository);

  selectedRecipeIds = this._recipeIds.asReadonly();
  selectedRecipes = rxResource({
    params: () => {
      const recipeIds = this._recipeIds();
      if (recipeIds.length > 0) {
        return { recipeIds };
      }
      return undefined;
    },
    stream: ({ params }) => {
      return combineLatest(
        params.recipeIds.map((id) => this._repository.fetchRecipe(id)),
      ).pipe(
        map((recipes) => recipes.filter((recipe) => recipe !== undefined)),
      );
    },
  }).asReadonly();

  setRecipeIds(recipeIds: string[]) {
    this._recipeIds.set(recipeIds);
  }
}
