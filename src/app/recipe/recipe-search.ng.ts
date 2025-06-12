import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';
import { Catalog } from '../shared/catalog.ng';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [Catalog, RecipeAddButton, RecipeFilterForm, RecipePreview],
  template: `
    <wm-recipe-filter-form (filterChange)="filter.set($event)" />
    <wm-catalog>
      @for (recipe of recipes.value(); track recipe.id) {
      <wm-recipe-preview [recipe]="recipe">
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
      }
    </wm-catalog>
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilter>({});
  recipes = rxResource({
    params: this.filter,
    stream: ({ params }) =>
      this._recipeRepository
        .search({ filter: params, offset: 0, limit: 5 })
        .pipe(map((result) => result.items)),
  });

  private _recipeRepository = inject(RecipeRepository);
}
