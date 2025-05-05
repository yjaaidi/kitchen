import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core';
import { Grid } from '../shared/grid.ng';
import { RecipePreview } from './recipe-preview.ng';
import { Recipe } from './recipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-list',
  template: `
    <wm-grid>
      @for (recipe of recipes(); track recipe.id) {
        <wm-recipe-preview [recipe]="recipe">
          <ng-container
            *ngTemplateOutlet="
              actionsTemplateRef();
              context: { $implicit: recipe }
            "
          ></ng-container>
        </wm-recipe-preview>
      }
    </wm-grid>
  `,
  imports: [Grid, RecipePreview, NgTemplateOutlet],
})
export class RecipeList {
  recipes = input.required<Recipe[]>();

  actionsTemplateRef = contentChild.required<
    TemplateRef<{
      $implicit: Recipe;
    }>
  >('actions');
}
