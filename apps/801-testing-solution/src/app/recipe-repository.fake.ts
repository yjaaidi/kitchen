import { Recipe } from './recipe';
import { RecipeFilterCriteria } from './recipe-filter-criteria';

import { RecipeRepository } from './recipe-repository';

export class RecipeRepositoryFake implements Public<RecipeRepository> {
  private _recipes: Recipe[] = [];

  configure({ recipes }: { recipes: Recipe[] }) {
    this._recipes = recipes;
  }

  async searchRecipes(criteria: RecipeFilterCriteria = {}): Promise<Recipe[]> {
    for (const property of ['maxIngredients', 'maxSteps'] as const) {
      if (criteria?.[property] != null) {
        throw new Error(`RecipeRepositoryFake: '${property}' is not supported`);
      }
    }

    return this._recipes.filter((recipe) => {
      if (criteria.keywords) {
        return recipe.name
          .toLocaleLowerCase()
          .includes(criteria.keywords.toLocaleLowerCase());
      }
      return true;
    });
  }
}

type Public<T> = {
  [K in keyof T]: T[K];
};
