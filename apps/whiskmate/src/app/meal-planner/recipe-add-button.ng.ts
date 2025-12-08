import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { Recipe } from '../recipe/recipe';
import { MealPlanner } from './meal-planner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-add-button',
  imports: [MatButtonModule],
  template: `
    <button
      [disabled]="!canAdd()"
      (click)="addRecipe()"
      class="add-recipe-button"
      color="primary"
      mat-stroked-button
    >
      ADD
    </button>
  `,
  styles: `
    .add-recipe-button {
      display: block;
      margin: auto;
    }
  `,
})
export class RecipeAddButton {
  recipe = input.required<Recipe>();
  canAdd = computed(() => this._mealPlanner.canAddRecipe(this.recipe()));

  private _mealPlanner = inject(MealPlanner);

  addRecipe() {
    this._mealPlanner.addRecipe(this.recipe());
  }
}
