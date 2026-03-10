import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import {
  createDefaultRecipeFilterCriteria,
  RecipeFilterCriteria,
} from './recipe-filter-criteria';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-filter',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="filterForm">
      <input
        [formField]="filterForm.keywords"
        aria-label="Keywords"
        placeholder="keywords"
        type="text"
      />
      <input
        [formField]="filterForm.maxIngredientCount"
        aria-label="Max Ingredients"
        formControlName="maxIngredientCount"
        placeholder="max ingredients"
        type="number"
      />
      <input
        [formField]="filterForm.maxStepCount"
        aria-label="Max Steps"
        placeholder="max steps"
        type="number"
      />
    </form>
  `,
  styles: `
    :host {
      text-align: center;
    }
  `,
})
export class RecipeFilter {
  filter = model<RecipeFilterCriteria>(createDefaultRecipeFilterCriteria());

  filterForm = form(this.filter);
}
