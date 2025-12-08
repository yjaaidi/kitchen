import { TestBed } from '@angular/core/testing';
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { MealPlanner } from '../meal-planner/meal-planner';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch.name, () => {
  it('loads recipes', async () => {
    const { getRecipeNames } = mountRecipeSearch();

    await expect.poll(() => getRecipeNames()).toHaveLength(2);
  });

  it('filters recipes', async () => {
    const { getRecipeNames } = mountRecipeSearch();

    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Keywords' }),
      'Bur',
    );

    await expect.poll(() => getRecipeNames()).toHaveLength(1);
    await expect.poll(() => getRecipeNames()[0]).toHaveTextContent('Burger');
  });

  it('adds recipes to the meal planner', async () => {
    const { getMealPlannerRecipes } = mountRecipeSearch();

    const buttons = await screen.findAllByRole('button', { name: 'ADD' });
    await userEvent.click(buttons[0]);

    await expect
      .poll(() => getMealPlannerRecipes())
      .toContainEqual(expect.objectContaining({ name: 'Burger' }));
  });
});

function mountRecipeSearch() {
  TestBed.configureTestingModule({
    providers: [provideRecipeRepositoryFake()],
  });

  TestBed.inject(RecipeRepositoryFake).setRecipes([
    recipeMother.withBasicInfo('Burger').build(),
    recipeMother.withBasicInfo('Salad').build(),
  ]);

  TestBed.createComponent(RecipeSearch);

  return {
    async getMealPlannerRecipes() {
      return TestBed.inject(MealPlanner).recipes();
    },
    getRecipeNames() {
      return screen.getAllByRole('heading', { level: 2 });
    },
  };
}
