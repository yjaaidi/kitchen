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

  it.todo('displays first page of recipes', () => {
    // arrange: fake repository with 7 recipes (limit=5)
    // mount RecipeSearch component
    // assert 5 recipes displayed
  });

  it.todo('navigates to next page', () => {
    // arrange: fake repository with 7 recipes
    // mount component, click "Next"
    // assert next 2 recipes displayed
  });

  it.todo('navigates back to previous page', () => {
    // arrange: fake repository with 7 recipes
    // navigate to page 2, then click "Previous"
    // assert first 5 recipes displayed again
  });

  it.todo('resets to first page on filter change', () => {
    // arrange: fake repository with 7 recipes
    // navigate to page 2, then change keyword filter
    // assert offset resets to 0 and first page of filtered results shown
  });

  it.todo('shows spinner while loading', () => {
    // mount RecipeSearch component
    // assert spinner is visible while recipes are loading
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
