import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';
import { Catalog } from '../shared/catalog.ng';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Paginator } from '../shared/paginator.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    Catalog,
    RecipeAddButton,
    RecipeFilterForm,
    RecipePreview,
    Paginator,
  ],
  template: `
    <wm-recipe-filter-form (filterChange)="filter.set($event)" />
    <wm-catalog>
      @for (recipe of (recipes.value()?.items ?? []); track recipe.id) {
      <wm-recipe-preview [recipe]="recipe">
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
      }
    </wm-catalog>
    <wm-paginator
      [offset]="offset()"
      [limit]="limit()"
      [total]="recipes.value()?.total ?? 0"
      (offsetChange)="onOffsetChange($event)"
    />
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilter>({});
  offset = signal(0);
  limit = signal(5);

  recipes = rxResource({
    params: computed(() => ({
      filter: this.filter(),
      offset: this.offset(),
      limit: this.limit(),
    })),
    stream: ({ params }) =>
      this._recipeRepository
        .search(params)
        .pipe(map((result) => ({ items: result.items, total: result.total }))),
  });

  constructor() {
    effect(() => {
      this.filter();
      this.offset.set(0);
    });
  }

  onOffsetChange(newOffset: number) {
    this.offset.set(newOffset);
  }

  private _recipeRepository = inject(RecipeRepository);
}
