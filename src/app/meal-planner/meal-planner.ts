import { computed, Injectable, signal } from '@angular/core';
import { Recipe } from '../recipe/recipe';

@Injectable({ providedIn: 'root' })
export class MealPlanner {
  private _recipes = signal<Recipe[]>([]);

  recipes = this._recipes.asReadonly();

  addRecipe(recipe: Recipe) {
    if (!this._canAddRecipe({ recipe, recipes: this._recipes() })) {
      throw new Error(`Can't add recipe.`);
    }
    this._recipes.set([...this._recipes(), recipe]);
  }

  canAddRecipe(recipe: Recipe) {
    return this._canAddRecipe({ recipe, recipes: this._recipes() });
  }

  private _canAddRecipe({
    recipes,
    recipe,
  }: {
    recipes: Recipe[];
    recipe: Recipe;
  }) {
    return !recipes.some((r) => r.id === recipe.id);
  }
}
