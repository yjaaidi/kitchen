import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export type RecipeSearchArgs = RecipeFilter & { offset: number; limit: number };

export interface RecipePage {
  recipes: Recipe[];
  total: number;
}

export interface RecipeRepositoryDef {
  search(args: RecipeSearchArgs): Observable<RecipePage>;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeRepository implements RecipeRepositoryDef {
  private _httpClient = inject(HttpClient);

  search({
    keywords,
    maxIngredientCount,
  }: RecipeSearchArgs): Observable<RecipePage> {
    const params: ResponseListQueryParams = {
      embed: 'ingredients',
      ...(keywords ? { q: keywords } : {}),
    };

    return this._httpClient
      .get<RecipeListResponseDto>('https://recipe-api.marmicode.io/recipes', {
        params,
      })
      .pipe(
        map((response) => {
          const recipes = response.items
            .map((item) =>
              createRecipe({
                id: item.id,
                name: item.name,
                description: null,
                pictureUri: item.picture_uri,
                ingredients: item.ingredients ?? [],
                steps: [],
              }),
            )
            /* Filter max ingredients locally until it is implemented in the server. */
            .filter((r) =>
              maxIngredientCount != null
                ? r.ingredients.length <= maxIngredientCount
                : true,
            );
          const total = response.total ?? response.items.length;
          return { recipes, total };
        }),
      );
  }
}

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
};

interface RecipeListResponseDto {
  items: RecipeDto[];
  total?: number;
}

interface RecipeDto {
  id: string;
  created_at: string;
  name: string;
  picture_uri: string;
  ingredients?: IngredientDto[];
}

interface IngredientDto {
  id: string;
  name: string;
}
