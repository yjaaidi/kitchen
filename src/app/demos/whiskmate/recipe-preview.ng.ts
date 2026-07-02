import { Component, input } from '@angular/core';
import { Recipe } from '../../recipe/recipe';
import { Card } from '../../shared/card.ng';

@Component({
  selector: 'app-recipe-preview',
  imports: [Card],
  template: `
    <app-card [pictureUri]="recipe().pictureUri" [alt]="recipe().name + ' picture'">
      <h2>{{ recipe().name }}</h2>
      <div class="actions">
        <ng-content />
      </div>
    </app-card>
  `,
  styles: `
    h2 {
      font-size: 1.2em;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-top: 0.5rem;
    }
  `,
})
export class RecipePreview {
  recipe = input.required<Recipe>();
}
