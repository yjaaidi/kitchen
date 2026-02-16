import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';
import { Catalog } from '../shared/catalog.ng';
import { Paginator } from '../shared/paginator.ng';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';

const PAGE_SIZE = 5;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    Catalog,
    MatProgressSpinnerModule,
    RecipeAddButton,
    Paginator,
    RecipeFilterForm,
    RecipePreview,
  ],
  template: `
    <wm-recipe-filter-form (filterChange)="onFilterChange($event)" />
    @if (recipes.isLoading()) {
      <mat-spinner aria-label="Loading recipes" />
    }
    <wm-catalog>
      @for (recipe of recipes.value()?.recipes ?? []; track recipe.id) {
        <wm-recipe-preview [recipe]="recipe">
          <wm-recipe-add-button [recipe]="recipe" />
        </wm-recipe-preview>
      }
    </wm-catalog>
    @if (recipes.value(); as page) {
      <wm-paginator
        [offset]="offset()"
        [limit]="pageSize"
        [total]="page.total"
        (offsetChange)="offset.set($event)"
      />
    }
  `,
})
export class RecipeSearch {
  protected readonly pageSize = PAGE_SIZE;

  filter = signal<RecipeFilter>({});
  offset = linkedSignal(() => {
    this.filter();
    return 0;
  });

  protected onFilterChange(filter: RecipeFilter) {
    this.filter.set(filter);
  }

  recipes = rxResource({
    params: () => ({
      ...this.filter(),
      offset: this.offset(),
      limit: PAGE_SIZE,
    }),
    stream: ({ params }) => this._recipeRepository.search(params),
  });

  private _recipeRepository = inject(RecipeRepository);
}
