import { Component, computed, signal } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import {
  createEmptyFilterModel,
  RecipeFilterModel,
  toRecipeFilter,
} from '../../recipe/recipe-filter';

@Component({
  selector: 'app-recipe-filter-form',
  imports: [FormField],
  template: `
    <form class="filter">
      <div class="field">
        <label for="keywords">Keywords</label>
        <input id="keywords" type="text" [formField]="filterForm.keywords" />
      </div>

      <div class="field">
        <label for="maxIngredientCount">Max Ingredients</label>
        <input
          id="maxIngredientCount"
          type="number"
          [formField]="filterForm.maxIngredientCount"
        />
      </div>

      <div class="field">
        <label for="maxStepCount">Max Steps</label>
        <input id="maxStepCount" type="number" [formField]="filterForm.maxStepCount" />
      </div>
    </form>
  `,
  styles: `
    :host {
      display: block;
      text-align: center;
    }

    .filter {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      padding: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      text-align: left;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    input {
      padding: 0.5rem;
      min-width: 180px;
    }
  `,
})
export class RecipeFilterForm {
  readonly filterModel = signal<RecipeFilterModel>(createEmptyFilterModel());

  readonly filterForm = form(this.filterModel, (schemaPath) => {
    debounce(schemaPath.keywords, 200);
    debounce(schemaPath.maxIngredientCount, 200);
    debounce(schemaPath.maxStepCount, 200);
  });

  readonly recipeFilter = computed(() => toRecipeFilter(this.filterModel()));
}
