import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RecipeAddButton } from '../meal-planner/recipe-add-button.ng';
import { Catalog } from '../shared/catalog.ng';
import { Paginator } from '../shared/paginator.ng';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';

const PAGE_SIZE = 12;

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
    @if (allRecipes.isLoading()) {
      <p>Loading...</p>
    }
    @if (allRecipes.error()) {
      <p>Something went wrong.</p>
      <button (click)="allRecipes.reload()">Retry</button>
    }

    <wm-catalog>
      @for (recipe of paginatedRecipes(); track recipe.id) {
        <wm-recipe-preview [recipe]="recipe">
          <wm-recipe-add-button [recipe]="recipe" />
        </wm-recipe-preview>
      } @empty {
        <p>No recipes found.</p>
      }
    </wm-catalog>
    <wm-paginator
      [currentPage]="currentPage()"
      [totalPages]="totalPages()"
      [isLoading]="allRecipes.isLoading()"
      (previous)="goToPrevious()"
      (next)="goToNext()"
    />
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilter>({});
  currentPage = linkedSignal({ source: this.filter, computation: () => 0 });
  allRecipes = rxResource({
    params: this.filter,
    stream: ({ params }: { params: RecipeFilter }) =>
      this._recipeRepository.search(params),
  });

  paginatedRecipes = computed(() => {
    const all = this.allRecipes.value() ?? [];
    const p = this.currentPage();
    return all.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE);
  });

  totalPages = computed(() =>
    Math.ceil((this.allRecipes.value()?.length ?? 0) / PAGE_SIZE),
  );

  goToNext() {
    this.currentPage.update((p: number) => p + 1);
  }

  goToPrevious() {
    this.currentPage.update((p: number) => p - 1);
  }

  private _recipeRepository = inject(RecipeRepository);
}
