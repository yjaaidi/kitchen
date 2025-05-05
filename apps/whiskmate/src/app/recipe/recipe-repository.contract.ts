import { RecipeRepositoryDef } from './recipe-repository';
import { lastValueFrom } from 'rxjs';

export function verifyRecipeRepositoryContract({
  setUp,
}: {
  setUp: () => { repo: RecipeRepositoryDef };
}) {
  it('should fetch some recipes', async () => {
    const { repo } = setUp();

    const recipes = await lastValueFrom(repo.search());
    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
      }),
    );
  });

  it('should filter recipes using keywords', async () => {
    const { repo } = setUp();

    /* Grab the last recipe in the list... */
    const recipes = await lastValueFrom(repo.search());
    const lastRecipe = recipes[recipes.length - 1];

    /* ...and search for it by name... */
    const filteredRecipes = await lastValueFrom(
      repo.search(lastRecipe.name.toLowerCase()),
    );

    /* ...then make sure it's the first one in the filtered list. */
    expect(filteredRecipes.length).toBeGreaterThan(0);
    expect(filteredRecipes[0].name).toEqual(lastRecipe.name);
  });

  it('should return an empty array when no recipes match the query', async () => {
    const { repo } = setUp();

    const recipes = await lastValueFrom(repo.search('arecipethatdoesentexist'));
    expect(recipes).toEqual([]);
  });
}
