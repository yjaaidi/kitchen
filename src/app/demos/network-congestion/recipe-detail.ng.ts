import { HttpResourceRef } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Recipe } from '../../recipe/recipe';
import { Card } from '../../shared/card.ng';
import { RecipeId, RecipeStore } from './recipe-store';

@Component({
  selector: 'app-network-congestion-demo',
  imports: [Card],
  template: `
    <section class="recipe-detail" aria-labelledby="recipe-detail-heading">
      <h2 id="recipe-detail-heading" class="visually-hidden">Recipe detail</h2>

      <button type="button" class="next-button" (click)="goToNextRecipe()">Next recipe</button>

      @if (recipeResource(); as resource) {
        @if (resource.isLoading()) {
          <div role="status">Loading...</div>
        } @else if (resource.error(); as error) {
          <div role="alert">Failed to load recipe: {{ error.message }}</div>
        } @else if (resource.value(); as recipe) {
          <app-card [pictureUri]="recipe.pictureUri" [alt]="recipe.name + ' picture'">
            <h3>{{ recipe.name }}</h3>
            <ul class="ingredients">
              @for (ingredient of recipe.ingredients; track ingredient.name) {
                <li>{{ ingredient.name }}</li>
              }
            </ul>
          </app-card>
        }
      }
    </section>
  `,
  styles: `
    .recipe-detail {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem;
    }

    h3 {
      margin: 0 0 0.75rem;
      font-size: 1.25rem;
      text-align: center;
    }

    .ingredients {
      margin: 0;
      padding-left: 1.25rem;
    }

    .next-button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      border: 1px solid #333;
      border-radius: 4px;
      background: #fff;
    }

    .next-button:focus-visible {
      outline: 2px solid #333;
      outline-offset: 2px;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `,
})
export default class RecipeDetail {
  private readonly _store = inject(RecipeStore);

  protected readonly recipeIds = this._store.getRecipeIds();
  protected readonly recipeResource = signal<HttpResourceRef<Recipe | undefined>>(
    this.getRecipeResource(0),
  );

  goToNextRecipe() {
    const currentIndex = this.recipeIds.indexOf(this.recipeResource()?.value()?.id as RecipeId);
    const nextIndex = (currentIndex + 1) % this.recipeIds.length;
    this.recipeResource.set(this.getRecipeResource(nextIndex));
  }

  getRecipeResource(index: number) {
    return this._store.getRecipe(this.recipeIds[index]!);
  }
}
