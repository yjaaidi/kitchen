import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { RecipeRepository } from './recipe-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-viewer',
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

  constructor() {
    effect(() => {
      console.log(this.recipeIds());
    });
  }
}

export default RecipeViewer;
