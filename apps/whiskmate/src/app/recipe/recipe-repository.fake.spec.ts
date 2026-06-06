import { describe } from "vitest";
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { verifyRecipeRepositoryContract } from './recipe-repository.contract';
import { recipeMother } from './recipe.mother';

describe(RecipeRepositoryFake, () => {
  verifyRecipeRepositoryContract(createRecipeRepositoryFake);
});

function createRecipeRepositoryFake() {
  const recipeRepository = new RecipeRepositoryFake();
  recipeRepository.configure({
    recipes: [
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ],
  });
  return { recipeRepository };
}
