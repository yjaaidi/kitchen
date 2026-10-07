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

  it.todo('should display first page on load', () => {
    // arrange fake repository with 7 recipes
    // mount RecipeSearch
    // assert 5 recipe headings are visible
    // assert Previous is disabled and Next is enabled
  });

  it.todo('should navigate to next page', () => {
    // arrange fake repository with 7 recipes
    // mount RecipeSearch
    // click Next
    // assert 2 recipe headings are visible
    // assert Previous is enabled and Next is disabled
  });

  it.todo('should navigate back to previous page', () => {
    // arrange fake repository with 7 recipes
    // mount RecipeSearch; click Next; click Previous
    // assert 5 recipe headings from the first page are visible again
  });

  it.todo('should reset to page 1 when filter changes', () => {
    // arrange fake repository with 7 recipes including "Burger" and "Salad"
    // mount RecipeSearch; click Next to reach page 2
    // type "Burger" in the keywords field
    // assert only "Burger" is shown and Previous is disabled
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
