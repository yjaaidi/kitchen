import { Component, inject } from '@angular/core';
import { MealPlanner } from '../../meal-planner/meal-planner';
import { Catalog } from '../../shared/catalog.ng';
import { RecipePreview } from './recipe-preview.ng';
import { Fridge } from './fridge.ng';

@Component({
  selector: 'app-meal-plan',
  imports: [Catalog, Fridge, RecipePreview],
  template: `
    <section class="panel" aria-labelledby="planner-heading">
      <h2 id="planner-heading">Meal Planner</h2>
      @if (mealPlanner.recipes().length === 0) {
        <div class="empty-planner" role="status">
          <app-fridge />
          <p class="empty-message">Your meal planner is empty</p>
          <p class="empty-hint">Add recipes from the search panel to fill your fridge.</p>
        </div>
      } @else {
        <app-catalog>
          @for (recipe of mealPlanner.recipes(); track recipe.id) {
            <app-recipe-preview
              [recipe]="recipe"
              [showRemove]="true"
              (recipeRemove)="mealPlanner.removeRecipe($event)"
            />
          }
        </app-catalog>
      }
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

    .empty-planner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 220px);
      padding: 2rem 1rem;
      text-align: center;
      color: #64748b;
    }

    .empty-message {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: #475569;
    }

    .empty-hint {
      margin: 0;
      font-size: 0.9rem;
      max-width: 280px;
    }
  `,
})
export class MealPlan {
  protected readonly mealPlanner = inject(MealPlanner);
}
