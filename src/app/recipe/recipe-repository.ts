import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RecipeRepositoryDef {
  search(args: {
    filter: RecipeFilter;
    offset: number;
    limit: number;
  }): Observable<{ items: Recipe[]; total: number }>;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeRepository implements RecipeRepositoryDef {
  private _httpClient = inject(HttpClient);

  search({
    filter,
    offset,
    limit,
  }: {
    filter: RecipeFilter;
    offset: number;
    limit: number;
  }): Observable<{ items: Recipe[]; total: number }> {
    const { keywords, maxIngredientCount } = filter || {};
    const params: ResponseListQueryParams & { offset: number; limit: number } =
      {
        embed: 'ingredients',
        ...(keywords ? { q: keywords } : {}),
        offset,
        limit,
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
            .filter((recipe) =>
              maxIngredientCount != null
                ? recipe.ingredients.length <= maxIngredientCount
                : true
            );
          return { items, total: response.total };
        })
      );
  }
}

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
};

interface RecipeListResponseDto {
  items: RecipeDto[];
  total: number;
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
