import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, onTestFinished } from 'vitest';
import {
  resetMealPlannerStore,
  useMealPlannerStore,
} from '../meal-planner/meal-planner';
import { singletonTestingUtils } from '../shared/singleton';
import { createTestQueryClientWrapper } from '../testing';
import { recipeRepositorySingleton } from './recipe-repository';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch.name, () => {
  it('shows all recipes', async () => {
    const { findHeadings } = await setUp();

    const headings = await findHeadings();
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Burger');
    expect(headings[1]).toHaveTextContent('Salad');
  });

  it('filter recipes', async () => {
    const { findHeadings, typeKeywords } = await setUp();

    await typeKeywords('Salad');

    const headings = await findHeadings();
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Salad');
  });

  it('adds "burger" to meal planner when clicking on "ADD" button', async () => {
    const { findRecipePreviews } = await setUp();

    const recipePreviews = await findRecipePreviews();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const burgerEl = recipePreviews.find((e) =>
      within(e).queryByText('Burger'),
    )!;
    await userEvent.click(
      within(burgerEl).getByRole('button', { name: 'ADD' }),
    );
    expect(useMealPlannerStore.getState().recipes).toMatchObject([
      { name: 'Burger' },
    ]);
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

  render(<RecipeSearch />, {
    wrapper: createTestQueryClientWrapper(),
  });

  onTestFinished(() => {
    singletonTestingUtils.reset();
    resetMealPlannerStore();
  });

  return {
    findHeadings: () => screen.findAllByRole('heading'),
    findRecipePreviews: () => screen.findAllByRole('article'),
    typeKeywords: async (keywords: string) =>
      userEvent.type(await screen.findByLabelText('Keywords'), keywords),
  };
}
