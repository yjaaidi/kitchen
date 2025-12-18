import { createContext } from '@lit/context';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from './recipe';

export class MealPlanner {
  private _recipes$ = new BehaviorSubject<Recipe[]>([]);

  recipes$ = this._recipes$.asObservable();

  addRecipe(recipe: Recipe) {
    this._recipes$.next([...this._recipes$.value, recipe]);
  }
}

export const MEAL_PLANNER_CONTEXT = createContext<MealPlanner>(
  Symbol('meal-planner')
);
