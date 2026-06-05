import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { reset } from '../shared/shared.actions';
import { store } from '../store';
import { createTestQueryClientWrapper } from '../testing/test-query-client';
import { singletonTestingUtils } from '../util/singleton';
import { recipeRepositorySingleton } from './recipe-repository';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch, () => {
  afterEach(() => {
    singletonTestingUtils.reset();
    act(() => store.dispatch(reset()));
  });

  it('shows all recipes', async () => {
    const { findRecipeTitles } = await setUp();

    const recipeTitles = await findRecipeTitles();
    expect(recipeTitles).toHaveLength(2);
    expect(recipeTitles[0]).toHaveTextContent('Burger');
    expect(recipeTitles[1]).toHaveTextContent('Salad');
  });

  it('filter recipes', async () => {
    const { typeKeywords, findRecipeTitles } = await setUp();

    await typeKeywords('sal');

    await waitFor(async () => {
      const recipeTitles = await findRecipeTitles();
      expect(recipeTitles).toHaveLength(1);
      expect(recipeTitles[0]).toHaveTextContent('Salad');
    });
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

  const QueryClientWrapper = createTestQueryClientWrapper();

  render(<RecipeSearch />, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <QueryClientWrapper>{children}</QueryClientWrapper>
      </Provider>
    ),
  });

  return {
    clickAddOnRecipeWithName: async (name: string) => {
      const recipePreviews = await screen.findAllByRole('article');
      const recipePreview = recipePreviews.find(
        (preview) => within(preview).queryByRole('heading', { name }) != null,
      );
      if (!recipePreview) {
        throw new Error(`Recipe "${name}" not found`);
      }
      await act(async () =>
        userEvent.click(
          within(recipePreview).getByRole('button', { name: 'ADD' }),
        ),
      );
    },
    findRecipeTitles: () => screen.findAllByRole('heading'),
    getMealPlannerRecipes: () => store.getState().mealPlanner.recipes,
    typeKeywords: async (keywords: string) => {
      const input = await screen.findByLabelText('Keywords');
      await userEvent.type(input, keywords);
    },
  };
}
