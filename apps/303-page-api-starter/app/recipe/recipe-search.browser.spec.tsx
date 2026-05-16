import { screen, within } from '@testing-library/react';
import { describe, expect, it, onTestFinished } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { useMealPlannerStore } from '../meal-planner/meal-planner';
import { singletonTestingUtils } from '../shared/singleton';
import { createTestQueryClientWrapper, resetStore } from '../testing';
import { recipeRepositorySingleton } from './recipe-repository';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch, () => {
  it('shows all recipes', async () => {
    const { findHeadings } = await setUp();

    const headings = await findHeadings();
    expect(headings.length).toBeGreaterThanOrEqual(2);
    expect(headings[0]).toHaveTextContent('Burger');
    expect(headings[1]).toHaveTextContent('Salad');
  });

  it('filter recipes', async () => {
    const { findHeadings, typeKeywords } = await setUp();

    await typeKeywords('sal');

    const headings = await findHeadings();
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Salad');
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

  const findRecipePreviews = () => screen.findAllByRole('article');

  return {
    clickAddOnRecipeWithName: async (name: string) => {
      const recipePreviews = await findRecipePreviews();
      const recipeEl = recipePreviews.find((e) =>
        within(e).getByRole('heading', { name }),
      );
      if (!recipeEl) {
        throw new Error(`Recipe with name "${name}" not found`);
      }
      const recipeAddButton = within(recipeEl).getByRole('button', {
        name: 'ADD',
      });
      await userEvent.click(recipeAddButton);
    },
    findHeadings: () => screen.findAllByRole('heading'),
    findRecipePreviews,
    getMealPlannerRecipes: () => useMealPlannerStore.getState().recipes,
    typeKeywords: async (keywords: string) =>
      userEvent.type(await screen.findByLabelText('Keywords'), keywords),
  };
}
