import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  ResourceSnapshot,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RecipeAddButton } from '../../meal-planner/recipe-add-button.ng';
import { RecipeRepository } from '../../recipe/recipe-repository';
import { Recipe } from '../../recipe/recipe';
import { Catalog } from '../../shared/catalog.ng';
import { RecipeFilterForm } from './recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-slow-filtering-demo',
  imports: [Catalog, RecipeAddButton, RecipeFilterForm, RecipePreview],
  template: `
    <p class="tick" aria-live="polite">{{ currentTime() }}</p>

    <app-recipe-filter-form />

    <app-catalog>
      @if (recipesResource.isLoading()) {
        <div role="status">Loading...</div>
      }
      @for (recipe of recipes(); track $index) {
        <app-recipe-preview [recipe]="recipe">
          <app-recipe-add-button [recipe]="recipe" />
        </app-recipe-preview>
      }
    </app-catalog>
  `,
  styles: `
    .tick {
      text-align: center;
      color: #666;
      font-size: 0.875rem;
    }
  `,
})
export default class RecipeSearch {
  protected readonly currentTime = signal('');

  protected readonly filter = computed(() => this._filterForm()?.recipeFilter() ?? {});

  protected readonly recipesResource = resource({
    defaultValue: [],
    params: () => this.filter(),
    loader: ({ params }) => firstValueFrom(this._repo.search(params)),
  });

  protected readonly recipes = linkedSignal<ResourceSnapshot<Recipe[]>, Recipe[]>({
    source: () => this.recipesResource.snapshot(),
    computation: (snapshot, prev) =>
      snapshot.status === 'resolved' ? snapshot.value : (prev?.value ?? []),
  });

  private _repo = inject(RecipeRepository);
  private _filterForm = viewChild.required(RecipeFilterForm);

  constructor() {
    effect((onCleanup) => {
      const id = setInterval(() => {
        this.currentTime.set(
          new Date().toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        );
      }, 100);
      onCleanup(() => clearInterval(id));
    });
  }
}
