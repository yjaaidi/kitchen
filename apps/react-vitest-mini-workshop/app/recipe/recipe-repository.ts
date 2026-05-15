import { useQuery } from '@tanstack/react-query';
import type { Recipe } from './recipe';
import type { RecipeFilter } from './recipe-filter';
import { defineSingleton } from '../shared/singleton';

class RecipeRepository {
  async searchRecipes(
    { keywords, maxIngredientCount }: RecipeFilter = {},
    { signal }: { signal?: AbortSignal } = {},
  ): Promise<Recipe[]> {
    const params = new URLSearchParams({ embed: 'ingredients' });
    if (keywords) {
      params.set('q', keywords);
    }

    const response = await fetch(
      `https://recipe-api.marmicode.io/recipes?${params}`,
      { signal },
    );
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
          : true,
      );
  }
}

export const recipeRepositorySingleton = defineSingleton(
  () => new RecipeRepository(),
);

export function useSearchRecipes(filter: RecipeFilter = {}) {
  return useQuery({
    queryKey: ['recipes', filter],
    queryFn: ({ signal }) =>
      recipeRepositorySingleton.get().searchRecipes(filter, { signal }),
  });
}

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
