import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { MealPlanner } from '../meal-planner/meal-planner';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository/recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch, () => {
  it('show recipes', async () => {
    const { findRecipeHeadings } = mountRecipeSearch();

    const headings = await findRecipeHeadings();

    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Burger');
    expect(headings[1]).toHaveTextContent('Salad');
  });

  it('filter recipes', async () => {
    const { findRecipeHeadings, typeKeywords } = mountRecipeSearch();

    await typeKeywords('Bur');

    const headings = await findRecipeHeadings();

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Burger');
  });

  it('adds recipes to meal plan', async () => {
    const { findAddButtons, getMealPlannerRecipes } = mountRecipeSearch();

    const addButtons = await findAddButtons();

    await userEvent.click(addButtons[0]);

    expect(getMealPlannerRecipes()).toMatchObject([{ name: 'Burger' }]);
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
    findRecipeHeadings: () => screen.findAllByRole('heading', { level: 2 }),
    findAddButtons: () => screen.findAllByRole('button', { name: 'ADD' }),
    getMealPlannerRecipes: () => TestBed.inject(MealPlanner).recipes(),
    typeKeywords: async (keywords: string) => {
      await userEvent.type(await screen.findByLabelText('Keywords'), keywords);
    },
  };
}
