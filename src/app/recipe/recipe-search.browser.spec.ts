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

  describe('pagination display — US1', () => {
    it('should show 12 recipes on page 1 with "Page 1 of 3" when 25 recipes match', async () => {
      const { recipeHeadings, pageLabel } = await setUpPaginatedSearch(25);
      await expect.element(recipeHeadings).toHaveLength(12);
      await expect.element(pageLabel).toHaveTextContent('Page 1 of 3');
    });

    it('should show all recipes without pagination controls when results fit one page', async () => {
      const { recipeHeadings, pageLabel } = await setUpPaginatedSearch(5);
      await expect.element(recipeHeadings).toHaveLength(5);
      await expect.element(pageLabel).not.toBeInTheDocument();
    });

    it('should show no results message when search returns no recipes', async () => {
      const { noResultsMsg, pageLabel } = await setUpPaginatedSearch(0);
      await expect.element(noResultsMsg).toBeInTheDocument();
      await expect.element(pageLabel).not.toBeInTheDocument();
    });
  });

  describe('page navigation — US2', () => {
    it('should show page 2 results and update label when Next is clicked', async () => {
      const { recipeHeadings, nextButton, pageLabel } =
        await setUpPaginatedSearch(25);

      await nextButton.click();

      await expect.element(recipeHeadings).toHaveLength(12);
      await expect.element(pageLabel).toHaveTextContent('Page 2 of 3');
    });

    it('should return to page 1 results when Previous is clicked from page 2', async () => {
      const { recipeHeadings, nextButton, prevButton, pageLabel } =
        await setUpPaginatedSearch(25);

      await nextButton.click();
      await expect.element(pageLabel).toHaveTextContent('Page 2 of 3');

      await prevButton.click();

      await expect.element(recipeHeadings).toHaveLength(12);
      await expect.element(pageLabel).toHaveTextContent('Page 1 of 3');
    });

    it('should have Next disabled on the last page', async () => {
      /* 13 recipes → 2 pages; one Next click reaches the last page. */
      const { nextButton } = await setUpPaginatedSearch(13);
      await nextButton.click();
      await expect.element(nextButton).toBeDisabled();
    });

    it('should have Previous disabled on page 1', async () => {
      const { prevButton } = await setUpPaginatedSearch(25);
      await expect.element(prevButton).toBeDisabled();
    });

    it('should show loading indicator while results are being fetched', async () => {
      const { recipeRepoFake } = await setUpRecipeSearch();
      recipeRepoFake.setRecipes(makeRecipes(25));
      recipeRepoFake.pause();
      await t.mount(RecipeSearch);

      await expect.element(page.getByText('Loading...')).toBeVisible();
    });

    it('should not reset currentPage when retrying after an error', async () => {
      const { recipeRepoFake } = await setUpRecipeSearch();
      recipeRepoFake.setRecipes(makeRecipes(25));
      recipeRepoFake.simulateError();
      await t.mount(RecipeSearch);

      await expect
        .element(page.getByRole('button', { name: 'Retry' }))
        .toBeVisible();

      recipeRepoFake.clearError();
      await page.getByRole('button', { name: 'Retry' }).click();

      await expect
        .element(page.getByText(/Page 1 of/))
        .toBeInTheDocument();
    });
  });

  describe('filter reset — US3', () => {
    it('should reset to page 1 when filter changes while on page 2', async () => {
      const { nextButton, pageLabel, keywordsInput } =
        await setUpPaginatedSearch(25);

      await nextButton.click();
      await expect.element(pageLabel).toHaveTextContent('Page 2 of 3');

      /* All 25 recipes are named "Recipe N" so they all match "Recipe". */
      await keywordsInput.fill('Recipe');

      await expect.element(pageLabel).toHaveTextContent('Page 1 of 3');
    });
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

async function setUpPaginatedSearch(recipeCount: number) {
  const { recipeRepoFake } = await setUpRecipeSearch();
  recipeRepoFake.setRecipes(makeRecipes(recipeCount));
  await t.mount(RecipeSearch);
  return getPaginationControls();
}

function getPaginationControls() {
  return {
    recipeHeadings: page.getByRole('heading', { level: 2 }),
    pageLabel: page.getByText(/Page \d+ of \d+/),
    nextButton: page.getByRole('button', { name: 'Next' }),
    prevButton: page.getByRole('button', { name: 'Previous' }),
    keywordsInput: page.getByRole('textbox'),
    loadingIndicator: page.getByText('Loading...'),
    retryButton: page.getByRole('button', { name: 'Retry' }),
    noResultsMsg: page.getByText('No recipes found.'),
  };
}

function makeRecipes(count: number) {
  return Array.from({ length: count }, (_, i) =>
    recipeMother.withBasicInfo(`Recipe ${i + 1}`).build(),
  );
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
