import { describe } from "vitest";
import { recipeRepositorySingleton } from './recipe-repository';
import { verifyRecipeRepositoryContract } from './recipe-repository.contract';

describe('RecipeRepository', () => {
  verifyRecipeRepositoryContract(createRecipeRepository);
});

function createRecipeRepository() {
  return { recipeRepository: recipeRepositorySingleton.get() };
}
