import { describe, expect, it, onTestFinished } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { useMealPlannerStore } from '../meal-planner/meal-planner';
import { singletonTestingUtils } from '../util/singleton';
import { createTestQueryClientWrapper } from '../testing/test-query-client';
import { resetStore } from '../testing/reset-store';
import { recipeRepositorySingleton } from './recipe-repository';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch, () => {
  it('shows all recipes', async () => {
    const { recipeTitles } = await setUp();

    await expect.element(recipeTitles).toHaveLength(2);
    await expect.element(recipeTitles.nth(0)).toHaveTextContent('Burger');
    await expect.element(recipeTitles.nth(1)).toHaveTextContent('Salad');
  });

  it('filter recipes', async () => {
    const { recipeTitles, typeKeywords } = await setUp();

    await typeKeywords('sal');

    await expect.element(recipeTitles).toHaveTextContent('Salad');
  });

  it('adds "burger" to meal planner when clicking on "ADD" button', async () => {
    const { clickAddOnRecipeWithName, getMealPlannerRecipes } = await setUp();

    await clickAddOnRecipeWithName('Burger');

    expect(getMealPlannerRecipes()).toMatchObject([{ name: 'Burger' }]);
  });
});

async function setUp() {
  singletonTestingUtils.override(recipeRepositorySingleton, () => {
    const fake = new RecipeRepositoryFake();
    fake.configure({
      recipes: [
        recipeMother.withBasicInfo('Burger').build(),
        recipeMother.withBasicInfo('Salad').build(),
      ],
    });
    return fake;
  });

  onTestFinished(() => {
    singletonTestingUtils.reset();
    resetStore(useMealPlannerStore);
  });

  await render(<RecipeSearch />, {
    wrapper: createTestQueryClientWrapper(),
  });

  const recipePreviews = page.getByRole('article');

  return {
    clickAddOnRecipeWithName: async (name: string) => {
      await recipePreviews
        .filter({
          has: page.getByRole('heading', { name }),
        })
        .getByRole('button', { name: 'ADD' })
        .click();
    },
    recipePreviews,
    recipeTitles: recipePreviews.getByRole('heading'),
    getMealPlannerRecipes: () => useMealPlannerStore.getState().recipes,
    typeKeywords: async (keywords: string) =>
      page.getByLabelText('Keywords').fill(keywords),
  };
}
