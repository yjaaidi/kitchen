import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Recipe } from '../../recipe/recipe';
import { Card } from '../../shared/card.ng';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recipe-preview',
  imports: [Card],
  template: `
    @defer (on timer(500)) {
      <app-card [pictureUri]="recipe().pictureUri" [alt]="recipe().name + ' picture'">
        @defer (on timer(500)) {
          <h2>{{ recipe().name }}</h2>
        } @placeholder {
          <h2 class="placeholder" aria-hidden="true">&nbsp;</h2>
        }

        @defer (on timer(500)) {
          <p class="difficulty">Difficulty: {{ difficulty() }}</p>
        } @placeholder {
          <p class="difficulty placeholder" aria-hidden="true">&nbsp;</p>
        }

        @defer (on timer(500)) {
          <ng-content />
        }
      </app-card>
    } @placeholder {
      <div class="card-placeholder" aria-hidden="true"></div>
    }
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

    .placeholder {
      visibility: hidden;
    }

    .card-placeholder {
      width: 300px;
      height: 380px;
      border-radius: 10px;
      background: #f5f5f5;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
