import { expect, it } from "vitest";
import { RecipeRepository } from './recipe-repository';

export function verifyRecipeRepositoryContract(
  createRecipeRepository: CreateRecipeRepository,
) {
  it('returns all recipes', async () => {
    const { recipeRepository } = createRecipeRepository();

    const recipes = await recipeRepository.searchRecipes();

    expect(recipes).toContainEqual(expect.objectContaining({ name: 'Burger' }));
  });

  it('filters recipes containg "burg" keywords', async () => {
    const { recipeRepository } = createRecipeRepository();

    const recipes = await recipeRepository.searchRecipes({ keywords: 'burg' });

    const burgerRecipes = recipes.filter((recipe) =>
      recipe.name.includes('Burger'),
    );
    const otherRecipes = recipes.filter(
      (recipe) => !recipe.name.includes('Burger'),
    );
    expect(burgerRecipes.length).toBeGreaterThanOrEqual(1);
    expect(otherRecipes).toHaveLength(0);
  });

  it('returns an empty array when no recipes are found', async () => {
    const { recipeRepository } = createRecipeRepository();

    const recipes = await recipeRepository.searchRecipes({
      keywords: 'pizza with salmon and pineapple',
    });

    expect(recipes).toHaveLength(0);
  });
}

type CreateRecipeRepository = () => {
  recipeRepository: RecipeRepository;
};
