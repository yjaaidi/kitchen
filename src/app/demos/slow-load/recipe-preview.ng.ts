import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Recipe } from '../../recipe/recipe';
import { Card } from '../../shared/card.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-preview',
  imports: [Card],
  template: `
    <app-card [pictureUri]="recipe().pictureUri" [alt]="recipe().name + ' picture'">
      <h2>{{ recipe().name }}</h2>
      <p class="difficulty">Difficulty: {{ difficulty() }}</p>
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

  protected readonly difficulty = computed(() => {
    const recipe = this.recipe();
    const ingredientsCount = Math.min(recipe.ingredients.length, 10);
    const stepsCount = Math.min(recipe.steps.length, 10);
    return Math.round((ingredientsCount + stepsCount / 20) * 5);
  });
}
