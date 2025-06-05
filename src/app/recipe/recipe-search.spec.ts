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
