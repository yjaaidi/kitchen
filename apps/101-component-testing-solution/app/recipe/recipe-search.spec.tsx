import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, onTestFinished } from 'vitest';
import { useMealPlannerStore } from '../meal-planner/meal-planner';
import { createTestQueryClientWrapper, resetStore } from '../testing';
import { RecipeSearch } from './recipe-search';

describe(RecipeSearch, () => {
  it('shows all recipes', async () => {
    const { findHeadings } = await setUp();

    const headings = await findHeadings();
    expect(headings).toHaveLength(2);
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
  render(<RecipeSearch />, {
    wrapper: createTestQueryClientWrapper(),
  });

  onTestFinished(() => {
    resetStore(useMealPlannerStore);
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
