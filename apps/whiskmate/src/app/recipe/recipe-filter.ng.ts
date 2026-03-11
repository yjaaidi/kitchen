import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  createDefaultRecipeFilterCriteria,
  RecipeFilterCriteria,
} from './recipe-filter-criteria';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-filter',
  imports: [
    FormField,
    FormRoot,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <form class="filter-form" [formRoot]="filterForm">
      <mat-form-field>
        <mat-label>Keywords</mat-label>
        <input [formField]="filterForm.keywords" matInput type="text" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Max Ingredients</mat-label>
        <input
          [formField]="filterForm.maxIngredientCount"
          matInput
          type="number"
        />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Max Steps</mat-label>
        <input [formField]="filterForm.maxStepCount" matInput type="number" />
      </mat-form-field>
    </form>
  `,
  styles: `
    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;

      margin-top: 1rem;
    }
  `,
})
export class RecipeFilter {
  filter = model<RecipeFilterCriteria>(createDefaultRecipeFilterCriteria());

  filterForm = form(this.filter);
}
