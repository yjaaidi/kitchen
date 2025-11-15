import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { t } from '../testing/ng-test-utils';
import { recipeMother } from '../testing/recipe.mother';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';
import { describe, it, expect } from 'vitest';

describe(RecipeSearch.name, () => {
  it('should search recipes without filtering', async () => {
    const { getRecipeNames } = await mountRecipeSearch();

    expect(getRecipeNames()).toEqual(['Burger', 'Salad', 'Pizza', 'Beer']);
  });

  it('should filter recipes by keyword', async () => {
    const { getRecipeNames, typeKeyword } = await mountRecipeSearch();

    await typeKeyword('Burger');

    expect(getRecipeNames()).toEqual(['Burger']);
  });

  describe('Pagination', () => {
    it('should show pagination controls when more than 12 recipes', async () => {
      const { mount, recipeRepoFake, getPaginator } = await setUpRecipeSearch();

      recipeRepoFake.setRecipes(
        Array.from({ length: 25 }, (_, i) =>
          recipeMother.withBasicInfo(`Recipe ${i + 1}`).build()
        )
      );

      await mount();

      expect(getPaginator()).toBeInTheDocument();
    });

    it('should hide pagination controls when 12 or fewer recipes', async () => {
      const { mount, recipeRepoFake, getPaginator } = await setUpRecipeSearch();

      recipeRepoFake.setRecipes(
        Array.from({ length: 10 }, (_, i) =>
          recipeMother.withBasicInfo(`Recipe ${i + 1}`).build()
        )
      );

      await mount();

      expect(getPaginator()).not.toBeInTheDocument();
    });

    it('should display only 12 recipes on first page', async () => {
      const { mount, recipeRepoFake, getRecipeNames } =
        await setUpRecipeSearch();

      recipeRepoFake.setRecipes(
        Array.from({ length: 25 }, (_, i) =>
          recipeMother.withBasicInfo(`Recipe ${i + 1}`).build()
        )
      );

      await mount();

      expect(getRecipeNames()).toHaveLength(12);
      expect(getRecipeNames()[0]).toBe('Recipe 1');
      expect(getRecipeNames()[11]).toBe('Recipe 12');
    });

    it('should navigate to next page', async () => {
      const { mount, recipeRepoFake, getRecipeNames } =
        await setUpRecipeSearch();

      recipeRepoFake.setRecipes(
        Array.from({ length: 25 }, (_, i) =>
          recipeMother.withBasicInfo(`Recipe ${i + 1}`).build()
        )
      );

      await mount();

      // Click next page button
      const nextButton = screen.getByLabelText('Next page');
      await userEvent.click(nextButton);

      expect(getRecipeNames()).toHaveLength(12);
      expect(getRecipeNames()[0]).toBe('Recipe 13');
      expect(getRecipeNames()[11]).toBe('Recipe 24');
    });

    it('should navigate to previous page', async () => {
      const { mount, recipeRepoFake, getRecipeNames } =
        await setUpRecipeSearch();

      recipeRepoFake.setRecipes(
        Array.from({ length: 25 }, (_, i) =>
          recipeMother.withBasicInfo(`Recipe ${i + 1}`).build()
        )
      );

      await mount();

      // Go to page 2
      const nextButton = screen.getByLabelText('Next page');
      await userEvent.click(nextButton);

      // Go back to page 1
      const prevButton = screen.getByLabelText('Previous page');
      await userEvent.click(prevButton);

      expect(getRecipeNames()[0]).toBe('Recipe 1');
      expect(getRecipeNames()[11]).toBe('Recipe 12');
    });

    it('should reset to page 1 when filter changes', async () => {
      const { mount, recipeRepoFake, getRecipeNames, typeKeyword } =
        await setUpRecipeSearch();

      recipeRepoFake.setRecipes([
        ...Array.from({ length: 25 }, (_, i) =>
          recipeMother.withBasicInfo(`Recipe ${i + 1}`).build()
        ),
        ...Array.from({ length: 5 }, (_, i) =>
          recipeMother.withBasicInfo(`Burger ${i + 1}`).build()
        ),
      ]);

      await mount();

      // Navigate to page 2
      const nextButton = screen.getByLabelText('Next page');
      await userEvent.click(nextButton);

      expect(getRecipeNames()[0]).toBe('Recipe 13');

      // Change filter
      await typeKeyword('Burger');

      // Should be back on page 1 with filtered results
      expect(getRecipeNames()[0]).toBe('Burger 1');
      expect(getRecipeNames()).toHaveLength(5);
    });

    it('should display last page with remaining recipes', async () => {
      const { mount, recipeRepoFake, getRecipeNames } =
        await setUpRecipeSearch();

      recipeRepoFake.setRecipes(
        Array.from({ length: 25 }, (_, i) =>
          recipeMother.withBasicInfo(`Recipe ${i + 1}`).build()
        )
      );

      await mount();

      // Navigate to last page directly
      const lastPageButton = screen.getByLabelText('Last page');
      await userEvent.click(lastPageButton);

      expect(getRecipeNames()).toHaveLength(1); // 25 - (2 * 12) = 1
      expect(getRecipeNames()[0]).toBe('Recipe 25');
    });
  });
});

async function mountRecipeSearch() {
  const { mount, recipeRepoFake, ...utils } = await setUpRecipeSearch();

  recipeRepoFake.setRecipes([
    recipeMother.withBasicInfo('Burger').build(),
    recipeMother.withBasicInfo('Salad').build(),
    recipeMother.withBasicInfo('Pizza').build(),
    recipeMother.withBasicInfo('Beer').build(),
  ]);

  await mount();

  return utils;
}

async function setUpRecipeSearch() {
  t.configure({ providers: [provideRecipeRepositoryFake()] });

  return {
    recipeRepoFake: t.inject(RecipeRepositoryFake),
    mount() {
      return t.mount(RecipeSearch);
    },
    getRecipeNames() {
      return screen.queryAllByRole('heading').map((el) => el.textContent);
    },
    async typeKeyword(keyword: string) {
      const input = screen.getByRole('textbox');
      await userEvent.type(input, keyword);
    },
    getPaginator() {
      return screen.queryByLabelText('Select page of recipes');
    },
  };
}
