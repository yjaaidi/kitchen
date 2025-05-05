import { ChangeDetectionStrategy, Component } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, map } from 'rxjs/operators';
import { createRecipeFilterCriteria } from './recipe-filter-criteria';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-filter',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="filterFormGroup">
      <mat-form-field>
        <mat-label>Keywords</mat-label>
        <input
          data-role="keywords-input"
          formControlName="keywords"
          matInput
          type="text"
        />
      </mat-form-field>
    </form>
  `,
  styles: [
    `
      :host {
        text-align: center;
      }
    `,
  ],
})
export class RecipeFilter {
  filterFormGroup = new FormGroup({
    keywords: new FormControl(),
  });

  filterChange = outputFromObservable(
    this.filterFormGroup.valueChanges.pipe(
      debounceTime(50),
      map((value) => createRecipeFilterCriteria(value)),
    ),
  );
}
