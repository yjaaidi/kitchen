import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
    @if (hasNoRecipesSelected()) {
      <div>No recipes selected</div>
    }

    @for (recipe of recipes.value(); track recipe.id) {
      <div>
        <h2>{{ recipe?.name }}</h2>
      </div>
    }
  `,
})
export class RecipeViewer {
  recipeIds = input(undefined, {
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
    params: () => {
      const recipeIds = this.recipeIds();
      if (recipeIds != null) {
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
  });

  hasNoRecipesSelected = computed(() => {
    return this.recipes.status() === 'idle' && !this.recipes.hasValue();
  });

  private _repository = inject(RecipeRepository);

  constructor() {
    effect(() => {
      // TODO: Maybe hook this to the store.
      console.log(this.recipeIds());
    });
  }
}

export default RecipeViewer;
