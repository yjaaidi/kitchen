import type { ReadonlySignal } from '@preact/signals-react';
import { signal } from '@preact/signals-react';
import type { Recipe } from '../recipe/recipe';

class MealPlanner {
  private _recipes = signal<Recipe[]>([]);

  get recipes(): ReadonlySignal<Recipe[]> {
    return this._recipes;
  }

  addRecipe(recipe: Recipe): void {
    if (this._recipes.value.some((r) => r.id === recipe.id)) {
      throw new Error('Recipe already added');
    }
    this._recipes.value = [...this._recipes.value, recipe];
  }

  canAddRecipe(recipe: Recipe) {
    return !this._recipes.value.some((r) => r.id === recipe.id);
  }

  removeRecipe(recipe: Recipe): void {
    this._recipes.value = this._recipes.value.filter((r) => r.id !== recipe.id);
  }
}

export const mealPlanner = new MealPlanner();
