import { BehaviorSubject } from 'rxjs';
import { Recipe } from './recipe';
import { createSingleton } from './singleton';

export class MealPlanner {
  private _recipes$ = new BehaviorSubject<Recipe[]>([]);

  recipes$ = this._recipes$.asObservable();

  addRecipe(recipe: Recipe) {
    this._recipes$.next([...this._recipes$.value, recipe]);
  }
}

export const mealPlannerSingleton = createSingleton(() => new MealPlanner());
