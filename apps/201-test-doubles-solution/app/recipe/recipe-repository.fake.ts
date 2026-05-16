import { Public } from '../util/public';
import type { Recipe } from './recipe';
import type { RecipeFilter } from './recipe-filter';
import type { RecipeRepository } from './recipe-repository';

export class RecipeRepositoryFake implements Public<RecipeRepository> {
  private _recipes: Recipe[] = [];

  configure({ recipes }: { recipes: Recipe[] }): void {
    this._recipes = [...recipes];
  }

  async searchRecipes(
    { keywords, maxIngredientCount }: RecipeFilter = {},
    { signal }: { signal?: AbortSignal } = {},
  ): Promise<Recipe[]> {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    let results = [...this._recipes];

    if (keywords) {
      const lowerKeywords = keywords.toLowerCase();
      results = results.filter((r) =>
        r.name.toLowerCase().includes(lowerKeywords),
      );
    }

    if (maxIngredientCount != null) {
      results = results.filter(
        (r) => r.ingredients.length <= maxIngredientCount,
      );
    }

    return results;
  }
}
