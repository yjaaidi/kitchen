import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs/operators';
import { createRecipeFilter } from './recipe-filter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-filter-form',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="filterFormGroup">
      <mat-form-field>
        <mat-label>Keywords</mat-label>
        <input formControlName="keywords" matInput type="text" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Max Ingredients</mat-label>
        <input formControlName="maxIngredientCount" matInput type="number" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Max Steps</mat-label>
        <input formControlName="maxStepCount" matInput type="number" />
      </mat-form-field>
    </form>
  `,
  styles: `
    :host {
      text-align: center;
    }
  `,
})
export class RecipeFilterForm {
  filterFormGroup = new FormGroup({
    keywords: new FormControl(),
    maxIngredientCount: new FormControl(),
    maxStepCount: new FormControl(),
  });

  filterChange = outputFromObservable(
    this.filterFormGroup.valueChanges.pipe(
      map((value) => createRecipeFilter(value))
    )
  );
}
