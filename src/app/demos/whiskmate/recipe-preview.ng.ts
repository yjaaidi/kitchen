import { Component, input, output } from '@angular/core';
import { Recipe } from '../../recipe/recipe';
import { Card } from '../../shared/card.ng';

@Component({
  selector: 'app-recipe-preview',
  imports: [Card],
  template: `
    <app-card [pictureUri]="recipe().pictureUri" [alt]="recipe().name + ' picture'">
      <h2>{{ recipe().name }}</h2>
      <div class="actions">
        @if (showAdd()) {
          <button
            type="button"
            class="add-button"
            [disabled]="!canAdd()"
            (click)="onAdd()"
          >
            Add
          </button>
        }
        @if (showRemove()) {
          <button type="button" class="remove-button" (click)="onRemove()">
            Remove
          </button>
        }
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

    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
})
export class RecipePreview {
  recipe = input.required<Recipe>();
  canAdd = input(false);
  showAdd = input(false);
  showRemove = input(false);

  recipeAdd = output<Recipe>();
  recipeRemove = output<Recipe>();

  onAdd() {
    this.recipeAdd.emit(this.recipe());
  }

  onRemove() {
    this.recipeRemove.emit(this.recipe());
  }
}
