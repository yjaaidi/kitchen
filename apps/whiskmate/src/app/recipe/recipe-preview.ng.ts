import { Card } from './../shared/card.ng';
import type { Recipe } from './recipe';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-preview',
  imports: [Card],
  template: `@if (recipe()) {
    <wm-card [pictureUri]="recipe().pictureUri">
      <h2 data-role="recipe-name">{{ recipe().name }}</h2>
      <div class="actions"><ng-content /></div>
    </wm-card>
  }`,
  styles: [
    `
      h2 {
        font-size: 1.2em;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .actions {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class RecipePreview {
  recipe = input.required<Recipe>();
}
