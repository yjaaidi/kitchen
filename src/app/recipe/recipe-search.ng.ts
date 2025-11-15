import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { PaginationControls } from './pagination-controls.ng';
import {
  computePaginationState,
  getPageItems,
  shouldShowPagination,
} from './pagination-state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    Catalog,
    RecipeAddButton,
    RecipeFilterForm,
    RecipePreview,
    PaginationControls,
  ],
  template: `
    <wm-recipe-filter-form (filterChange)="onFilterChange($event)" />
    <wm-catalog>
      @for (recipe of paginatedRecipes(); track recipe.id) {
      <wm-recipe-preview [recipe]="recipe">
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
      }
    </wm-catalog>
    
    @if (showPagination()) {
      <wm-pagination-controls
        [totalItems]="paginationState().totalItems"
        [pageSize]="paginationState().pageSize"
        [currentPage]="paginationState().currentPage"
        (pageChange)="onPageChange($event)" />
    }
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilter>({ page: 1 });

  // Fetch ALL recipes (ignore page number for API call)
  private allRecipes = rxResource({
    params: computed(() => ({
      keywords: this.filter().keywords,
      maxIngredientCount: this.filter().maxIngredientCount,
      maxStepCount: this.filter().maxStepCount,
    })),
    stream: ({ params }) => this._recipeRepository.search(params),
  });

  // Slice to current page
  paginatedRecipes = computed(() => {
    const all = this.allRecipes.value() ?? [];
    const page = this.filter().page ?? 1;
    return getPageItems(all, page);
  });

  // Calculate pagination state
  paginationState = computed(() => {
    const total = this.allRecipes.value()?.length ?? 0;
    const page = this.filter().page ?? 1;
    return computePaginationState(total, page);
  });

  // Check if pagination should be visible
  showPagination = computed(() => {
    const total = this.allRecipes.value()?.length ?? 0;
    return shouldShowPagination(total);
  });

  // Handle page changes
  onPageChange(page: number): void {
    this.filter.update((f) => ({ ...f, page }));
  }

  // Handle filter changes (reset to page 1)
  onFilterChange(newFilter: Omit<RecipeFilter, 'page'>): void {
    this.filter.set({ ...newFilter, page: 1 });
  }

  private _recipeRepository = inject(RecipeRepository);
}
