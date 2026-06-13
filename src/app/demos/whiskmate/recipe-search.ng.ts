import {
  Component,
  computed,
  inject,
  linkedSignal,
  ResourceSnapshot,
  resource,
  viewChild,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MealPlanner } from '../../meal-planner/meal-planner';
import { Recipe } from '../../recipe/recipe';
import { RecipeRepository } from '../../recipe/recipe-repository';
import { Catalog } from '../../shared/catalog.ng';
import { RecipeFilterForm } from '../../shared/recipe-filter-form.ng';
import { RecipePreview } from './recipe-preview.ng';

@Component({
  selector: 'app-recipe-search',
  imports: [Catalog, RecipeFilterForm, RecipePreview],
  template: `
    <section class="panel" aria-labelledby="search-heading">
      <h2 id="search-heading">Recipe Search</h2>
      <app-recipe-filter-form />
      <app-catalog>
        @if (recipesResource.isLoading()) {
          <div role="status">Loading recipes...</div>
        }
        @for (recipe of recipes(); track recipe.id) {
          <app-recipe-preview
            [recipe]="recipe"
            [showAdd]="true"
            [canAdd]="mealPlanner.canAddRecipe(recipe)"
            (recipeAdd)="mealPlanner.addRecipe($event)"
          />
        }
      </app-catalog>
    </section>
  `,
  styles: `
    .panel {
      padding: 1rem;
    }

    h2 {
      text-align: center;
      margin: 0 0 1rem;
      font-size: 1.25rem;
    }
  `,
})
export class RecipeSearch {
  protected readonly mealPlanner = inject(MealPlanner);

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

  private readonly _repo = inject(RecipeRepository);
  private readonly _filterForm = viewChild.required(RecipeFilterForm);
}
