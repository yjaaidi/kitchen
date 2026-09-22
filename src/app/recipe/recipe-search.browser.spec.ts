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

  it('disables Previous on the first page', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Tacos').build(),
      recipeMother.withBasicInfo('Curry').build(),
    ]);

    await mount();

    await expect
      .element(page.getByRole('button', { name: 'Previous' }))
      .toBeDisabled();
  });

  it('disables Next on the last page', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Tacos').build(),
      recipeMother.withBasicInfo('Curry').build(),
    ]);

    await mount();

    await page.getByRole('button', { name: 'Next' }).click();

    await expect
      .element(page.getByRole('button', { name: 'Next' }))
      .toBeDisabled();
  });

  it('returns to the first page when the filter changes', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Tacos').build(),
      recipeMother.withBasicInfo('Curry').build(),
      recipeMother.withBasicInfo('Ramen').build(),
      recipeMother.withBasicInfo('Steak').build(),
      recipeMother.withBasicInfo('Soup').build(),
      recipeMother.withBasicInfo('Pasta').build(),
      recipeMother.withBasicInfo('Cake').build(),
    ]);

    const { keywordsInput, recipeHeadings } = await mount();

    await page.getByRole('button', { name: 'Next' }).click();

    await keywordsInput.fill('Burger');

    await expect.element(recipeHeadings).toHaveTextContent('Burger');
  });

  it.todo('omits pager when results fit in one page', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Beer').build(),
    ]);

    await mount();

    await expect
      .element(page.getByRole('button', { name: 'Next' }))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole('button', { name: 'Previous' }))
      .not.toBeInTheDocument();
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
