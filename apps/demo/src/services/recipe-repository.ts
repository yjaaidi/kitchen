import type { Recipe, RecipeFilterCriteria } from '../types/recipe';

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

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
};

export class RecipeRepository {
  async search({
    keywords,
    maxIngredientCount,
  }: RecipeFilterCriteria = {}): Promise<Recipe[]> {
    const params: ResponseListQueryParams = {
      embed: 'ingredients',
      ...(keywords ? { q: keywords } : {}),
    };

    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    const url = `https://recipe-api.marmicode.io/recipes?${queryString}`;

    const response = await fetch(url);
    const data: RecipeListResponseDto = await response.json();

    return data.items
      .map((item) => ({
        id: item.id,
        name: item.name,
        description: null,
        pictureUri: item.picture_uri,
        ingredients: item.ingredients ?? [],
        steps: [],
      }))
      .filter((recipe) =>
        maxIngredientCount != null
          ? recipe.ingredients.length <= maxIngredientCount
          : true
      );
  }
}

// Singleton instance
export const recipeRepository = new RecipeRepository();

