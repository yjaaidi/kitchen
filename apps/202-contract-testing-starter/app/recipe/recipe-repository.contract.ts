import { expect, it } from 'vitest';
import { RecipeRepository } from './recipe-repository';

export function verifyRecipeRepositoryContract(
  createRecipeRepository: CreateRecipeRepository,
) {
  it.todo('returns all recipes', async () => {
    throw new Error('🚧 Work in progress!');
  });

  it.todo('filters recipes containg "burg" keywords', async () => {
    throw new Error('🚧 Work in progress!');
  });

  it.todo('returns an empty array when no recipes are found', async () => {
    throw new Error('🚧 Work in progress!');
  });
}

type CreateRecipeRepository = () => {
  recipeRepository: RecipeRepository;
};
