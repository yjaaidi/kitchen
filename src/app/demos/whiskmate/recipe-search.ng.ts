import { Component, computed, inject, resource, viewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MealPlanner } from '../../meal-planner/meal-planner';
import { RecipeRepository } from '../../recipe/recipe-repository';
import { RecipeFilterForm } from '../../shared/recipe-filter-form.ng';
import { RecipeList } from './recipe-list.ng';

@Component({
  selector: 'app-recipe-search',
  imports: [RecipeFilterForm, RecipeList],
  template: `
    <section class="panel" aria-labelledby="search-heading">
      <h2 id="search-heading">Recipe Search</h2>
      <app-recipe-filter-form />
      <app-recipe-list [recipesResource]="recipesResource">
        <ng-template let-recipe>
          <button
            type="button"
            class="add-button"
            [disabled]="!mealPlanner.canAddRecipe(recipe)"
            (click)="mealPlanner.addRecipe(recipe)"
          >
            Add
          </button>
        </ng-template>
      </app-recipe-list>
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

    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
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

  private readonly _repo = inject(RecipeRepository);
  private readonly _filterForm = viewChild.required(RecipeFilterForm);
}
