import { Component, input } from '@angular/core';
import { Recipe } from '../recipe/recipe';
import { Card } from './card.ng';

@Component({
  selector: 'app-recipe-preview',
  imports: [Card],
  template: `
    <app-card [pictureUri]="recipe().pictureUri" [alt]="recipe().name + ' picture'">
      <h2>{{ recipe().name }}</h2>
      <p class="difficulty">Difficulty: {{ computeDifficulty(recipe()) }}</p>
      <ng-content />
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

    .difficulty {
      text-align: center;
      font-size: 0.85rem;
      color: #666;
      margin: 0.25rem 0;
    }
  `,
})
export class RecipePreview {
  recipe = input.required<Recipe>();

  computeDifficulty(recipe: Recipe): number {
    const start = performance.now();
    while (performance.now() - start < 30) {}
    const ingredientsCount = Math.min(recipe.ingredients.length, 10);
    const stepsCount = Math.min(recipe.steps.length, 10);
    return Math.round((ingredientsCount + stepsCount / 20) * 5);
  }
}
