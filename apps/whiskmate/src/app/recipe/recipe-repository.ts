import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { RecipeFilterCriteria } from './recipe-filter-criteria';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RecipeRepositoryDef {
  search(filter: RecipeFilterCriteria): Observable<Recipe[]>;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeRepository implements RecipeRepositoryDef {
  private _httpClient = inject(HttpClient);

  search({
    keywords,
    maxIngredientCount,
  }: RecipeFilterCriteria = {}): Observable<Recipe[]> {
    const params: ResponseListQueryParams = {
      embed: 'ingredients',
      ...(keywords ? { q: keywords } : {}),
    };

    return this._httpClient
      .get<RecipeListResponseDto>('https://recipe-api.marmicode.io/recipes', {
        params,
      })
      .pipe(
        map((response) =>
          response.items
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
            /* Filter max ingredients locally meanwhile it is implemented server-side. */
            .filter((recipe) =>
              maxIngredientCount != null
                ? recipe.ingredients.length <= maxIngredientCount
                : true,
            ),
        ),
      );
  }
}

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
};

interface RecipeListResponseDto {
  items: RecipeDto[];
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
