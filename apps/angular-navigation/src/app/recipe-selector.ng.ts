import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RecipeRepository } from './recipe-repository';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-selector',
  template: `
    <h1>Recipe Selector</h1>
    <ul>
      @for (recipe of recipes.value(); track recipe.id) {
      <li>
        {{ recipe.name }}
      </li>
      }
    </ul>
  `,
})
export class RecipeSelector {
  private _repository = inject(RecipeRepository);

  recipes = rxResource({
    stream: () => this._repository.fetchRecipes(),
  });
}

export default RecipeSelector;
