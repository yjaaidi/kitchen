import { TestBed } from '@angular/core/testing';
import { screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { MealPlanner } from '../meal-planner/meal-planner';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository/recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch.name, () => {
  it('loads recipes', async () => {
    const { findRecipeNames } = mountRecipeSearch();

    expect(await findRecipeNames()).toHaveLength(2);
  });

  it('filters recipes', async () => {
    const { getRecipeNames } = mountRecipeSearch();

    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Keywords' }),
      'Bur',
    );

    await waitFor(() => {
      const recipeNames = getRecipeNames();
      expect(recipeNames).toHaveLength(1);
      expect(recipeNames[0]).toHaveTextContent('Burger');
    });
  });

  it('adds recipes to the meal planner', async () => {
    const { getMealPlannerRecipes } = mountRecipeSearch();

    const buttons = await screen.findAllByRole('button', { name: 'ADD' });
    await userEvent.click(buttons[0]);

    expect(getMealPlannerRecipes()).toContainEqual(
      expect.objectContaining({ name: 'Burger' }),
    );
  });
});

function mountRecipeSearch() {
  TestBed.configureTestingModule({
    providers: [provideRecipeRepositoryFake()],
  });

  TestBed.inject(RecipeRepositoryFake).configure({
    recipes: [
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ],
  });

  TestBed.createComponent(RecipeSearch);

  return {
    getMealPlannerRecipes() {
      return TestBed.inject(MealPlanner).recipes();
    },
    getRecipeNames() {
      return screen.getAllByRole('heading', { level: 2 });
    },
    findRecipeNames() {
      return screen.findAllByRole('heading', { level: 2 });
    },
  };
}
