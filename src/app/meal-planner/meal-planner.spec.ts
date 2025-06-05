import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { recipeMother } from '../testing/recipe.mother';
import { MealPlanner } from './meal-planner';

describe(MealPlanner.name, () => {
  it('adds recipe', async () => {
    const { mealPlanner, burger, salad } = createMealPlanner();

    mealPlanner.addRecipe(burger);
    mealPlanner.addRecipe(salad);

    expect(mealPlanner.recipes()).toEqual([
      expect.objectContaining({ name: 'Burger' }),
      expect.objectContaining({ name: 'Salad' }),
    ]);
  });

  it('throws error if recipe is already present', () => {
    const { mealPlanner, burgerDuplicate } = createMealPlannerWithBurger();

    expect(() => mealPlanner.addRecipe(burgerDuplicate)).toThrow(
      `Can't add recipe.`
    );
  });

  describe(MealPlanner.prototype.canAddRecipe.name, () => {
    it('returns true if recipe can be added', () => {
      const { mealPlanner, burger } = createMealPlanner();

      expect(mealPlanner.canAddRecipe(burger)).toBe(true);
    });

    it(`returns false when recipe is added and can't be added anymore`, () => {
      const { mealPlanner, burger } = createMealPlanner();

      mealPlanner.addRecipe(burger);
      expect(mealPlanner.canAddRecipe(burger)).toBe(false);
    });
  });

  function createMealPlannerWithBurger() {
    const { mealPlanner, burger, ...utils } = createMealPlanner();

    mealPlanner.addRecipe(burger);

    return {
      mealPlanner,
      ...utils,
    };
  }

  function createMealPlanner() {
    const { getMealPlanner, ...utils } = setUpMealPlanner();

    return {
      mealPlanner: getMealPlanner(),
      ...utils,
    };
  }

  function setUpMealPlanner() {
    return {
      getMealPlanner() {
        return TestBed.inject(MealPlanner);
      },
      burger: recipeMother.withBasicInfo('Burger').build(),
      burgerDuplicate: recipeMother.withBasicInfo('Burger').build(),
      salad: recipeMother.withBasicInfo('Salad').build(),
    };
  }
});
