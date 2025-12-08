import { Injectable } from '@angular/core';
import { map, Observable, timer } from 'rxjs';
import { Recipe } from './recipe';

@Injectable({ providedIn: 'root' })
export class RecipeRepository {
  private _recipes: Recipe[] = [
    {
      id: 'rec_burger',
      path: '/grand-ma-recipes/burger',
      name: "Grandma's Burger",
      description: 'A classic burger with a side of fries',
    },
    {
      id: 'rec_pizza',
      path: '/grand-ma-recipes/pizza',
      name: "Grandma's Pizza",
      description: 'A classic pizza with a side of salad',
    },
  ];

  fetchRecipes(): Observable<Recipe[]> {
    return timer(1000).pipe(map(() => this._recipes));
  }

  fetchRecipe(id: string): Observable<Recipe | undefined> {
    return this.fetchRecipes().pipe(
      map((recipes) => recipes.find((recipe) => recipe.id === id))
    );
  }

  fetchRecipeByPath(recipePath: string) {
    console.log('fetchRecipeByPath', recipePath);
    return this.fetchRecipes().pipe(
      map((recipes) => recipes.find((recipe) => recipe.path === recipePath))
    );
  }
}
