import { Recipe } from './recipe';
import { RecipeFilterCriteria } from './recipe-filter-criteria';

export class RecipeRepository {
  async searchRecipes(
    filterCriteria: RecipeFilterCriteria = {},
    { signal }: { signal?: AbortSignal } = {}
  ): Promise<Recipe[]> {
    const url = new URL('https://recipes-api.marmicode.io/recipes');
    url.searchParams.set('embed', 'ingredients,steps');
    if (filterCriteria.keywords) {
      url.searchParams.set('q', filterCriteria.keywords);
    }
    if (filterCriteria.maxIngredients) {
      url.searchParams.set(
        'maxIngredients',
        filterCriteria.maxIngredients.toString()
      );
    }
    if (filterCriteria.maxSteps) {
      url.searchParams.set('maxSteps', filterCriteria.maxSteps.toString());
    }

    const response = await fetch(url, { signal });
    const data: RecipeListResponseDto = await response.json();
    return data.items.map((item) => ({
      id: item.id,
      description: item.description,
      ingredients:
        item.ingredients?.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.name,
        })) ?? [],
      name: item.name,
      pictureUri: item.picture_uri,
      steps: item.steps,
    }));
  }
}

export const recipeRepository = new RecipeRepository();

interface RecipeListResponseDto {
  items: RecipeDto[];
}

interface RecipeDto {
  id: string;
  description: string | null;
  ingredients: IngredientDto[];
  name: string;
  picture_uri: string;
  steps: string[];
}

interface IngredientDto {
  id: string;
  name: string;
}
