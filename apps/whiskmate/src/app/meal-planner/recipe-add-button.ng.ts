import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { Recipe } from '../recipe/recipe';
import { MealPlanner } from './meal-planner';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-add-button',
  imports: [MatButtonModule],
  template: `
    <button
      [disabled]="!canAdd.value()"
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
  canAdd = rxResource({
    params: () => this.recipe(),
    stream: ({ params }) => this._mealPlanner.watchCanAddRecipe(params),
    defaultValue: false,
  });

  private _mealPlanner = inject(MealPlanner);

  addRecipe() {
    this._mealPlanner.addRecipe(this.recipe());
  }
}
