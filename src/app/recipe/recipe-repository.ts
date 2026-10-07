import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RecipePage {
  items: Recipe[];
  total: number;
}

export interface RecipePagination {
  offset?: number;
  limit?: number;
}

export interface RecipeRepositoryDef {
  search(
    filter: RecipeFilter,
    pagination?: RecipePagination,
  ): Observable<RecipePage>;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeRepository implements RecipeRepositoryDef {
  private _httpClient = inject(HttpClient);

  search(
    { keywords, maxIngredientCount }: RecipeFilter = {},
    pagination?: RecipePagination,
  ): Observable<RecipePage> {
    const params: ResponseListQueryParams = {
      embed: 'ingredients',
      ...(pagination?.offset != null ? { offset: pagination.offset } : {}),
      ...(pagination?.limit != null ? { limit: pagination.limit } : {}),
      ...(keywords ? { q: keywords } : {}),
    };

    return this._httpClient
      .get<RecipeListResponseDto>('https://recipe-api.marmicode.io/recipes', {
        params,
      })
      .pipe(
        map((response) => {
          const items = response.items
            .map((item) =>
              createRecipe({
                id: item.id,
                name: item.name,
                description: null,
                pictureUri: item.picture_uri,
                ingredients: item.ingredients ?? [],
                steps: [],
              })
            )
            /* Filter max ingredients locally meanwhile it is implemented server-side. */
            .filter((recipe) =>
              maxIngredientCount != null
                ? recipe.ingredients.length <= maxIngredientCount
                : true
            );
          return { items, total: response.total ?? items.length };
        })
      );
  }
}

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
  offset?: number;
  limit?: number;
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
