import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe } from '../recipe/recipe';
import { LocalStorage } from '../shared/local-storage';

export interface MealRepositoryDef {
  addMeal(recipe: Recipe): Observable<void>;

  getMeals(): Observable<Recipe[]>;
}

@Injectable({
  providedIn: 'root',
})
export class MealRepository implements MealRepositoryDef {
  private _localStorage = inject(LocalStorage);
  private _meals: Recipe[] = [];

  constructor() {
    this._meals = this._loadMeals();
  }

  addMeal(meal: Recipe): Observable<void> {
    this._updateMeals([...this._meals, meal]);
    return of(undefined);
  }

  getMeals(): Observable<Recipe[]> {
    return of(this._meals);
  }

  private _loadMeals(): Recipe[] {
    const rawValue = this._localStorage.getItem(LOCAL_STORAGE_KEY);

    if (rawValue == null) {
      return [];
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return [];
    }
  }

  private _updateMeals(meals: Recipe[]) {
    this._meals = meals;
    this._localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meals));
  }
}

const LOCAL_STORAGE_KEY = 'meals';
