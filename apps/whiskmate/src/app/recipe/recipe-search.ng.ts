import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Catalog } from '../shared/catalog.ng';
import { RecipeFilterCriteria } from './recipe-filter-criteria';
import { RecipeFilter } from './recipe-filter.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [Catalog, RecipeAddButton, RecipeFilter, RecipePreview],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)"></wm-recipe-filter>

    @if (recipes.isLoading()) {
      <img alt="Loading" src="https://marmicode.io/assets/loading.gif" />
    }

    @if (recipes.hasValue() && recipes.value().length === 0) {
      <img alt="Sad Marmicode" src="https://marmicode.io/assets/error.gif" />
      <p role="alert">No recipes found.</p>
    }

    <wm-catalog>
      @for (recipe of recipes.value(); track recipe.id) {
        <wm-recipe-preview [recipe]="recipe" data-testid="recipe-preview">
          <wm-recipe-add-button [recipe]="recipe" />
        </wm-recipe-preview>
      }
    </wm-catalog>
  `,
  styles: `
    :host {
      display: block;
      padding-top: 1rem;
      text-align: center;
    }
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilterCriteria>({});
  recipes = rxResource({
    params: () => this.filter(),
    stream: ({ params }) => this._recipeRepository.search(params),
  });

  private _recipeRepository = inject(RecipeRepository);
}
