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

describe(RecipeSearch.name, () => {
  it('loads recipes', async () => {
    const { getRecipeNames } = mountRecipeSearch();

    await expect.element(getRecipeNames()).toHaveLength(2);
  });

  it('filters recipes', async () => {
    const { getRecipeNames } = mountRecipeSearch();

    await page.getByRole('textbox', { name: 'Keywords' }).fill('Bur');

    await expect.element(getRecipeNames()).toHaveLength(1);
    await expect.element(getRecipeNames()).toHaveTextContent('Burger');
  });

  it('adds recipes to the meal planner', async () => {
    const { getMealPlannerRecipes } = mountRecipeSearch();

    await page.getByRole('button', { name: 'ADD' }).first().click();

    await expect
      .poll(() => getMealPlannerRecipes())
      .toContainEqual(expect.objectContaining({ name: 'Burger' }));
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
    async getMealPlannerRecipes() {
      return TestBed.inject(MealPlanner).recipes();
    },
    getRecipeNames() {
      return page.getByRole('heading', { level: 2 });
    },
  };
}
