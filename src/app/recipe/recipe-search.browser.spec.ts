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

  it('displays first page of recipes', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Soup').build(),
      recipeMother.withBasicInfo('Steak').build(),
      recipeMother.withBasicInfo('Fish').build(),
      recipeMother.withBasicInfo('Chicken').build(),
    ]);

    const { recipeHeadings } = await mount();

    await expect.element(recipeHeadings).toHaveLength(5);
  });

  it('navigates to next page', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Soup').build(),
      recipeMother.withBasicInfo('Steak').build(),
      recipeMother.withBasicInfo('Fish').build(),
      recipeMother.withBasicInfo('Chicken').build(),
    ]);

    const { recipeHeadings, nextButton } = await mount();

    await nextButton.click();

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Fish');
    await expect.element(recipeHeadings.nth(1)).toHaveTextContent('Chicken');
  });

  it('resets to first page on filter change', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Soup').build(),
      recipeMother.withBasicInfo('Steak').build(),
      recipeMother.withBasicInfo('Fish').build(),
      recipeMother.withBasicInfo('Chicken').build(),
    ]);

    const { recipeHeadings, keywordsInput, nextButton } = await mount();

    await nextButton.click();
    await keywordsInput.fill('Fish');

    await expect.element(recipeHeadings).toHaveLength(1);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Fish');
  });

  it('shows spinner while loading', async () => {
    const { mount, recipeRepoFake } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);
    recipeRepoFake.pause();

    const { spinner } = await mount();

    await expect.element(spinner).toBeVisible();
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
    mount: async () => {
      await t.mount(RecipeSearch);
      return {
        keywordsInput: page.getByRole('textbox'),
        nextButton: page.getByRole('button', { name: 'Next' }),
        previousButton: page.getByRole('button', { name: 'Previous' }),
        recipeHeadings: page.getByRole('heading', { level: 2 }),
        spinner: page.getByRole('progressbar'),
      };
    },
  };
}
