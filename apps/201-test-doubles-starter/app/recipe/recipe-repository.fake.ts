import { Public } from '../util/public';
import type { Recipe } from './recipe';
import type { RecipeFilter } from './recipe-filter';
import type { RecipeRepository } from './recipe-repository';

export class RecipeRepositoryFake implements Public<RecipeRepository> {
  configure({ recipes }: { recipes: Recipe[] }): void {
    // TODO: configure the fake repository with some recipes
    throw new Error('🚧 Work in progress!');
  }

  async searchRecipes({
    keywords,
    maxIngredientCount,
  }: RecipeFilter = {}): Promise<Recipe[]> {
    // TODO: filter recipes by keywords and maxIngredientCount
    throw new Error('🚧 Work in progress!');
  }
}
