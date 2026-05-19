import { RecipeRepositoryDef } from './recipe-repository';
import { lastValueFrom } from 'rxjs';

export function applyRecipeRepositoryContract(
  setUp: RepositoryContractSetUpFn,
) {
  test('returns recipes', async () => {
    const { repository } = await setUp();
    const recipes = await lastValueFrom(repository.search({}));
    expect(recipes.length).toBeGreaterThan(1);
    expect(recipes).toContainEqual(expect.objectContaining({ name: 'Burger' }));
  });

  test('filters recipes', async () => {
    const { repository } = await setUp();
    const recipes = await lastValueFrom(repository.search({ keywords: 'sal' }));
    expect(recipes).toHaveLength(1);
    expect(recipes[0].name).toBe('Salad');
  });

  test('return empty array if no recipes are found', async () => {
    const { repository } = await setUp();
    const recipes = await lastValueFrom(
      repository.search({ keywords: 'BurgerWithNutellaAndHam' }),
    );
    expect(recipes).toHaveLength(0);
  });
}

type RepositoryContractSetUpFn = () => Promise<{
  repository: RecipeRepositoryDef;
}>;
