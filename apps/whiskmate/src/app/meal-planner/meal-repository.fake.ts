import {
  EnvironmentProviders,
  Injectable,
  makeEnvironmentProviders,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe } from '../recipe/recipe';
import { MealRepository, MealRepositoryDef } from './meal-repository';

@Injectable()
export class MealRepositoryFake implements MealRepositoryDef {
  private _meals: Recipe[] = [];

  addMeal(meal: Recipe): Observable<void> {
    this._meals = [...this._meals, meal];
    return of(undefined);
  }

  getMeals(): Observable<Recipe[]> {
    return of(this._meals);
  }

  getMealsSync(): Recipe[] {
    return this._meals;
  }
}

export function provideMealRepositoryFake(): EnvironmentProviders {
  return makeEnvironmentProviders([
    MealRepositoryFake,
    {
      provide: MealRepository,
      useExisting: MealRepositoryFake,
    },
  ]);
}
