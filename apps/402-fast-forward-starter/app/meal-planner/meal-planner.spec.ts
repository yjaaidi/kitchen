import { describe, expect, it } from 'vitest';
import { createStore } from 'zustand';
import { recipeMother } from '../recipe/recipe.mother';
import {
  stateCreator as _stateCreator,
  useMealPlannerStore,
} from './meal-planner';

describe(useMealPlannerStore.name, () => {
  it('adds a recipe', () => {
    const { burger, salad, getState } = setUpMealPlannerStore();
    const { addRecipe } = getState();

    addRecipe(burger);
    addRecipe(salad);

    expect(getState().recipes).toMatchObject([
      { name: 'Burger' },
      { name: 'Salad' },
    ]);
  });

  it('cannot add a recipe that already exists', () => {
    const { burger, burgerClone, getState } = setUpMealPlannerStore();
    const { addRecipe } = getState();

    addRecipe(burger);

    expect(() => addRecipe(burgerClone)).toThrow();
  });

  it('tells if a recipe can be added', () => {
    const { burger, salad, getState } = setUpMealPlannerStore();
    const { addRecipe, canAddRecipe } = getState();

    addRecipe(burger);

    expect(canAddRecipe(salad)).toBe(true);
  });

  it("tells if a recipe can't be added", () => {
    const { burger, getState } = setUpMealPlannerStore();
    const { addRecipe, canAddRecipe } = getState();

    addRecipe(burger);

    expect(canAddRecipe(burger)).toBe(false);
  });

  it('removes a recipe', () => {
    const { burger, salad, getState } = setUpMealPlannerStore();
    const { addRecipe, removeRecipe } = getState();

    addRecipe(burger);
    addRecipe(salad);
    removeRecipe(burger);

    expect(getState().recipes).toMatchObject([{ name: 'Salad' }]);
  });
});

function setUpMealPlannerStore() {
  const store = createStore(_stateCreator);
  return {
    burger: recipeMother.withBasicInfo('Burger').build(),
    burgerClone: recipeMother.withBasicInfo('Burger').build(),
    salad: recipeMother.withBasicInfo('Salad').build(),
    getState: () => store.getState(),
  };
}
