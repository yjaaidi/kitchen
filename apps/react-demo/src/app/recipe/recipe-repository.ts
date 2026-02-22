import type { Recipe } from './recipe';
import type { RecipeFilterCriteria } from './recipe-filter-criteria';

class RecipeRepository {
  async searchRecipes(
    { keywords, maxIngredientCount }: RecipeFilterCriteria = {},
    signal?: AbortSignal,
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

export const recipeRepository = new RecipeRepository();

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
