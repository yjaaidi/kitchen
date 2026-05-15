import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, onTestFinished } from 'vitest';
import { useMealPlannerStore } from '../meal-planner/meal-planner';
import { createTestQueryClientWrapper, resetStore } from '../testing';
import { RecipeSearch } from './recipe-search';

describe(RecipeSearch, () => {
  it.todo('shows all recipes', async () => {
    throw new Error('🚧 Work in progress!');
  });

  it.todo('filter recipes', async () => {
    throw new Error('🚧 Work in progress!');
  });

  it.todo(
    'adds "burger" to meal planner when clicking on "ADD" button',
    async () => {
      throw new Error('🚧 Work in progress!');
    },
  );
});

async function setUp() {
  render(<RecipeSearch />, {
    wrapper: createTestQueryClientWrapper(),
  });

  onTestFinished(() => {
    resetStore(useMealPlannerStore);
  });

  return {
    findHeadings: () => screen.findAllByRole('heading'),
    findRecipePreviews: () => screen.findAllByRole('article'),
    getMealPlannerRecipes: () => useMealPlannerStore.getState().recipes,
    typeKeywords: async (keywords: string) =>
      userEvent.type(await screen.findByLabelText('Keywords'), keywords),
  };
}
