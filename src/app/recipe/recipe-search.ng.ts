import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';
import { Catalog } from '../shared/catalog.ng';
import { sliceCatalogPage } from '../shared/catalog-pagination';
import { CatalogPager } from '../shared/catalog-pager.ng';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';
import { DEFAULT_RECIPE_SEARCH_PAGE_LIMIT } from './recipe-search-pagination';
import { RecipeRepository } from './recipe-repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    Catalog,
    CatalogPager,
    RecipeAddButton,
    RecipeFilterForm,
    RecipePreview,
  ],
  template: `
    <wm-recipe-filter-form (filterChange)="onFilterChange($event)" />
    <wm-catalog>
      @for (recipe of pagedRecipes(); track recipe.id) {
      <wm-recipe-preview [recipe]="recipe">
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
      }
    </wm-catalog>
    @if (totalRecipes() > limit) {
    <wm-catalog-pager
      [offset]="offset()"
      [limit]="limit"
      [total]="totalRecipes()"
      (offsetChange)="offset.set($event)"
    />
    }
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilter>({});
  offset = signal(0);
  protected limit = DEFAULT_RECIPE_SEARCH_PAGE_LIMIT;
  recipes = rxResource({
    params: this.filter,
    stream: ({ params }) => this._recipeRepository.search(params),
  });
  protected totalRecipes = computed(() => this.recipes.value()?.length ?? 0);
  protected pagedRecipes = computed(() =>
    sliceCatalogPage(this.recipes.value() ?? [], {
      offset: this.offset(),
      limit: this.limit,
    }),
  );

  private _recipeRepository = inject(RecipeRepository);

  protected onFilterChange(filter: RecipeFilter) {
    this.filter.set(filter);
    this.offset.set(0);
  }
}
