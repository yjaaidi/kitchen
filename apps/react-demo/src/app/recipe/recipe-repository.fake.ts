import type { Recipe } from './recipe';
import type { RecipeFilterCriteria } from './recipe-filter-criteria';

export class RecipeRepositoryFake {
  private recipes: Recipe[] = [];

  configure({ recipes }: { recipes: Recipe[] }): void {
    this.recipes = [...recipes];
  }

  async searchRecipes(
    { keywords, maxIngredientCount }: RecipeFilterCriteria = {},
    { signal }: { signal?: AbortSignal } = {},
  ): Promise<Recipe[]> {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    let results = [...this.recipes];

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
