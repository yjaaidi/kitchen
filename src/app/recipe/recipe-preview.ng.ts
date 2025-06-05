import type { Recipe } from './recipe';
import { Card } from '../shared/card.ng';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-preview',
  imports: [Card],
  template: `<wm-card [pictureUri]="recipe().pictureUri">
    <h2>{{ recipe().name }}</h2>
    <ng-content />
  </wm-card>`,
  styles: [
    `
      h2 {
        font-size: 1.2em;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
})
export class RecipePreview {
  recipe = input.required<Recipe>();
}
