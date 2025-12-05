import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  createRecipeFilterCriteria,
  RecipeFilterCriteria,
} from './recipe-filter-criteria';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-filter',
  imports: [Field, MatFormFieldModule, MatInputModule],
  template: `
    <form (input)="emitFilterChange()">
      <mat-form-field>
        <mat-label>Keywords</mat-label>
        <input [field]="filterForm.keywords" matInput type="text" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Max Ingredients</mat-label>
        <input [field]="filterForm.maxIngredientCount" matInput type="number" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Max Steps</mat-label>
        <input [field]="filterForm.maxStepCount" matInput type="number" />
      </mat-form-field>
    </form>
  `,
  styles: `
    :host {
      text-align: center;
    }
  `,
})
export class RecipeFilter {
  filterForm = form<RecipeFilterForm>(
    signal({
      keywords: '',
      maxIngredientCount: '',
      maxStepCount: '',
    }),
  );

  filterChange = output<RecipeFilterCriteria>();

  emitFilterChange() {
    this.filterChange.emit(
      createRecipeFilterCriteria({
        keywords: this.filterForm.keywords().value() ?? undefined,
        maxIngredientCount: normalizeInt(
          this.filterForm.maxIngredientCount().value(),
        ),
        maxStepCount: normalizeInt(this.filterForm.maxStepCount().value()),
      }),
    );
  }
}

interface RecipeFilterForm {
  keywords: string;
  maxIngredientCount: string;
  maxStepCount: string;
}

function normalizeInt(value: string): number | undefined {
  const number = parseInt(value);
  return isNaN(number) ? undefined : number;
}
