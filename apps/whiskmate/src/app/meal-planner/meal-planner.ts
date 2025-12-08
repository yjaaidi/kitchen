import { Injectable, signal } from '@angular/core';
import { Recipe } from '../recipe/recipe';

@Injectable({ providedIn: 'root' })
export class MealPlanner {
  private _recipes = signal<Recipe[]>([]);

  recipes = this._recipes.asReadonly();

  addRecipe(recipe: Recipe) {
    this._recipes.update((recipes) => [...recipes, recipe]);
  }

  canAddRecipe(recipe: Recipe) {
    return !this._recipes().some((r) => r.id === recipe.id);
  }
}
