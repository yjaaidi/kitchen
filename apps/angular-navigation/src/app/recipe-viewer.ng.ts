import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { injectRecipeResolverData } from './recipe.resolver';
import { RecipeRepository } from './recipe-repository';
import { rxResource } from '@angular/core/rxjs-interop';
import { combineLatest, map, zip } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-viewer',
  imports: [],
  template: `
    <h1>Recipe Viewer</h1>
    @for (recipe of recipes.value(); track recipe.id) {
    <div>
      <h2>{{ recipe?.name }}</h2>
    </div>
    }
  `,
})
export class RecipeViewer {
  recipeIds = input.required({
    // eslint-disable-next-line @angular-eslint/no-input-rename
    alias: 'recipe_id',
    transform: (value: string | string[]) => {
      if (typeof value === 'string') {
        return [value];
      }
      return value;
    },
  });

  recipes = rxResource({
    params: () => ({ recipeIds: this.recipeIds() }),
    stream: () => {
      return combineLatest(
        this.recipeIds().map((id) => this._repository.fetchRecipe(id))
      ).pipe(
        map((recipes) => recipes.filter((recipe) => recipe !== undefined))
      );
    },
  });

  private _repository = inject(RecipeRepository);
}

export default RecipeViewer;
