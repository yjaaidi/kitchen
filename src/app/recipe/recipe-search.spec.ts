import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { t } from '../testing/ng-test-utils';
import { recipeMother } from '../testing/recipe.mother';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';
import { describe, it } from 'vitest';

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
});

describe('RecipeSearch pagination', () => {
  it('Go to next page', async () => {
    const { recipeRepoFake, mount, getRecipeNames } = await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Sushi').build(),
      recipeMother.withBasicInfo('Taco').build(),
      recipeMother.withBasicInfo('Pasta').build(),
    ]);

    await mount();

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    expect(getRecipeNames()).toEqual(['Taco', 'Pasta']);
  });

  it('When filter changes, reset to the first page', async () => {
    const { recipeRepoFake, mount, getRecipeNames, typeKeyword } =
      await setUpRecipeSearch();

    recipeRepoFake.setRecipes([
      recipeMother.withBasicInfo('Burger').build(), // first page
      recipeMother.withBasicInfo('Salad').build(),
      recipeMother.withBasicInfo('Pizza').build(),
      recipeMother.withBasicInfo('Beer').build(),
      recipeMother.withBasicInfo('Sushi').build(),
      recipeMother.withBasicInfo('Taco').build(),
      recipeMother.withBasicInfo('Another Burger').build(), // second page
    ]);

    await mount();

    // Go to next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    // Type 'Burger' in the search input
    await typeKeyword('Burger');

    // Assert that only 'Burger' and 'Another Burger' are displayed
    expect(getRecipeNames()).toEqual(['Burger', 'Another Burger']);
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
  };
}
