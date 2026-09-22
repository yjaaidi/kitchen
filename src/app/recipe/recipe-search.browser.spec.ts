import { describe, it } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { recipeMother } from '../testing/recipe.mother';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';

describe(RecipeSearch.name, () => {
  it('should search recipes without filtering', async () => {
    const { recipeHeadings } = await mountRecipeSearch();

    await expect.element(recipeHeadings).toHaveLength(4);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Burger');
    await expect.element(recipeHeadings.nth(1)).toHaveTextContent('Salad');
    await expect.element(recipeHeadings.nth(2)).toHaveTextContent('Pizza');
    await expect.element(recipeHeadings.nth(3)).toHaveTextContent('Beer');
  });

  it('should filter recipes by keyword', async () => {
    const { recipeHeadings, keywordsInput } = await mountRecipeSearch();

    await keywordsInput.fill('Burger');

    /* This also checks that there is **only one** recipe heading. */
    await expect.element(recipeHeadings).toHaveTextContent('Burger');
  });

  it('shows only the first five recipes when the result set is larger', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Tacos').build(),
      recipeMother.withBasicInfo('Curry').build(),
    ]);

    const { recipeHeadings } = await mount();

    await expect.element(recipeHeadings).toHaveLength(5);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Burger');
    await expect.element(recipeHeadings.nth(1)).toHaveTextContent('Salad');
    await expect.element(recipeHeadings.nth(2)).toHaveTextContent('Pizza');
    await expect.element(recipeHeadings.nth(3)).toHaveTextContent('Beer');
    await expect.element(recipeHeadings.nth(4)).toHaveTextContent('Tacos');
  });

  it('shows next page when user clicks Next', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Tacos').build(),
      recipeMother.withBasicInfo('Curry').build(),
    ]);

    const { recipeHeadings } = await mount();

    await page.getByRole('button', { name: 'Next' }).click();

    await expect.element(recipeHeadings).toHaveLength(1);
    await expect.element(recipeHeadings).toHaveTextContent('Curry');
    await expect
      .element(page.getByRole('heading', { level: 2, name: 'Burger' }))
      .not.toBeInTheDocument();
  });

  it.todo('disables Previous on the first page', () => {
    // Arrange Burger, Salad, Pizza, Beer, Tacos, Curry.
    // Mount `RecipeSearch`.
    // Assert Previous is disabled.
  });

  it.todo('disables Next on the last page', () => {
    // Arrange Burger, Salad, Pizza, Beer, Tacos, Curry; mount and click Next once.
    // Assert Next is disabled.
  });

  it.todo('returns to the first page when the filter changes', () => {
    // Arrange eleven recipes in order: Burger, Salad, Pizza, Beer, Tacos, Curry, Ramen, Steak, Soup, Pasta, Cake.
    // Mount, click Next once (second page shows Curry through Pasta).
    // Fill keywords with `Burger` so only one recipe matches.
    // Assert the sole visible heading is Burger (offset reset, not still on page two of the full list).
  });

  it.todo('omits pager when results fit in one page', () => {
    // Arrange four recipes: Burger, Salad, Pizza, Beer.
    // Mount `RecipeSearch`.
    // Assert Next and Previous are not in the document (or pager host is absent).
  });
});

async function mountRecipeSearch() {
  const { mount, recipeRepoFake } = await setUpRecipeSearch();

  recipeRepoFake.setRecipes([
    recipeMother.withBasicInfo('Burger').build(),
    recipeMother.withBasicInfo('Salad').build(),
    recipeMother.withBasicInfo('Pizza').build(),
    recipeMother.withBasicInfo('Beer').build(),
  ]);

  return mount();
}

async function setUpRecipeSearch() {
  t.configure({ providers: [provideRecipeRepositoryFake()] });

  return {
    recipeRepoFake: t.inject(RecipeRepositoryFake),
    mount: () => {
      t.mount(RecipeSearch);
      return {
        keywordsInput: page.getByRole('textbox'),
        recipeHeadings: page.getByRole('heading', { level: 2 }),
      };
    },
  };
}
