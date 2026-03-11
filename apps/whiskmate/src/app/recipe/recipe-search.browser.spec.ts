import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { MealPlanner } from '../meal-planner/meal-planner';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository/recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch, () => {
  it('show recipes', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Burger');
    await expect.element(recipeHeadings.nth(1)).toHaveTextContent('Salad');
  });

  it('filter recipes', async () => {
    const { recipeHeadings, typeKeywords } = mountRecipeSearch();

    await typeKeywords('Bur');

    await expect.element(recipeHeadings).toHaveTextContent('Burger');
  });

  it('adds recipes to meal plan', async () => {
    const { addButtons, getMealPlannerRecipes } = mountRecipeSearch();

    await addButtons.first().click();

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
    recipeHeadings: page.getByRole('heading', { level: 2 }),
    addButtons: page.getByRole('button', { name: 'ADD' }),
    getMealPlannerRecipes: () => TestBed.inject(MealPlanner).recipes(),
    typeKeywords: (keywords: string) =>
      page.getByRole('textbox', { name: 'Keywords' }).fill(keywords),
  };
}
