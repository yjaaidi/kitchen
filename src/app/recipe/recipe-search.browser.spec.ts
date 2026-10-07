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

  it('should display first page on load', async () => {
    const { recipeHeadings, previousButton, nextButton } =
      await mountRecipeSearchWithSevenRecipes();

    await expect.element(recipeHeadings).toHaveLength(5);
    await expect.element(previousButton).toBeDisabled();
    await expect.element(nextButton).toBeEnabled();
  });

  it('should navigate to next page', async () => {
    const { recipeHeadings, previousButton, nextButton } =
      await mountRecipeSearchWithSevenRecipes();

    await nextButton.click();

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect.element(previousButton).toBeEnabled();
    await expect.element(nextButton).toBeDisabled();
  });

  it('should navigate back to previous page', async () => {
    const { recipeHeadings, previousButton, nextButton } =
      await mountRecipeSearchWithSevenRecipes();

    await nextButton.click();
    await expect.element(recipeHeadings).toHaveLength(2);
    await previousButton.click();

    await expect.element(recipeHeadings).toHaveLength(5);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Burger');
    await expect.element(recipeHeadings.nth(4)).toHaveTextContent('Soup');
  });

  it('should reset to page 1 when filter changes', async () => {
    const { recipeHeadings, previousButton, nextButton, keywordsInput } =
      await mountRecipeSearchWithSevenRecipes();

    await nextButton.click();
    await expect.element(previousButton).toBeEnabled();
    await keywordsInput.fill('Burger');

    await expect.element(recipeHeadings).toHaveTextContent('Burger');
    await expect.element(previousButton).toBeDisabled();
  });
});

async function mountRecipeSearchWithSevenRecipes() {
  const { mount, recipeRepoFake } = await setUpRecipeSearch();

  recipeRepoFake.setRecipes(
    ['Burger', 'Salad', 'Pizza', 'Beer', 'Soup', 'Cake', 'Pasta'].map((name) =>
      recipeMother.withBasicInfo(name).build(),
    ),
  );

  return mount();
}

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
        previousButton: page.getByRole('button', { name: 'Previous' }),
        nextButton: page.getByRole('button', { name: 'Next' }),
      };
    },
  };
}
