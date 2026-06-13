import { Component, computed, inject, input } from '@angular/core';
import { Recipe } from '../recipe/recipe';
import { MealPlanner } from './meal-planner';

@Component({
  selector: 'app-recipe-add-button',
  template: `
    <button
      type="button"
      class="add-recipe-button"
      [disabled]="!canAdd()"
      (click)="addRecipe()"
    >
      ADD
    </button>
  `,
  styles: `
    .add-recipe-button {
      display: block;
      margin: auto;
      padding: 0.5rem 1.5rem;
      cursor: pointer;
    }

    .add-recipe-button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
})
export class RecipeAddButton {
  recipe = input.required<Recipe>();

  protected canAdd = computed(() =>
    this._mealPlanner.canAddRecipe(this.recipe()),
  );

  private _mealPlanner = inject(MealPlanner);

  addRecipe() {
    this._mealPlanner.addRecipe(this.recipe());
  }
}
