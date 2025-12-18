import { describe, expect, it, onTestFinished } from 'vitest';
import { page } from 'vitest/browser';
import { RecipeSearch } from './recipe-search';
import { mount } from './testing/mount';
import { recipeRepositorySingleton } from './recipe-repository';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { singletonTesting } from './singleton';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch.name, () => {
  it('displays all recipes', async () => {
    setUpAndMountRecipeSearch();

    const headings = page
      .getByRole('listitem')
      .getByRole('heading', { level: 2 });
    await expect.element(headings).toHaveLength(3);
    await expect.element(headings.nth(0)).toHaveTextContent('Burger');
    await expect.element(headings.nth(1)).toHaveTextContent('Salad');
    await expect.element(headings.nth(2)).toHaveTextContent('Beer');
  });

  it('filters recipes by keywords', async () => {
    setUpAndMountRecipeSearch();

    await page.getByPlaceholder('Search recipes').fill('bur');
    const heading = page
      .getByRole('listitem')
      .getByRole('heading', { level: 2 });
    await expect.element(heading).toHaveTextContent('Burger');
  });
});

function setUpAndMountRecipeSearch() {
  const fake = new RecipeRepositoryFake();

  fake.configure({
    recipes: [
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Beer').build(),
    ],
  });

  singletonTesting.override(recipeRepositorySingleton, fake);
  onTestFinished(() => {
    singletonTesting.reset(recipeRepositorySingleton);
  });

  mount(RecipeSearch);
}
