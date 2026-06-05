import { configureStore } from '@reduxjs/toolkit';
import { recipeMother } from '../recipe/recipe.mother';
import {
  addRecipe,
  mealPlannerRootReducer,
  removeRecipe,
  selectCanAddRecipe,
} from './meal-planner';

describe('MealPlannerStore', () => {
  it('adds a recipe', () => {
    const { burger, salad, dispatch, getState } = setUpMealPlannerStore();

    dispatch(addRecipe(burger));
    dispatch(addRecipe(salad));

    expect(getState().mealPlanner.recipes).toMatchObject([
      { name: 'Burger' },
      { name: 'Salad' },
    ]);
  });

  it('cannot add a recipe that already exists', () => {
    const { burger, burgerClone, dispatch } = setUpMealPlannerStore();

    dispatch(addRecipe(burger));

    expect(() => dispatch(addRecipe(burgerClone))).toThrow();
  });

  it('tells if a recipe can be added', () => {
    const { burger, salad, dispatch, getState } = setUpMealPlannerStore();

    dispatch(addRecipe(burger));

    expect(selectCanAddRecipe(getState(), salad)).toBe(true);
  });

  it("tells if a recipe can't be added", () => {
    const { burger, dispatch, getState } = setUpMealPlannerStore();

    dispatch(addRecipe(burger));

    expect(selectCanAddRecipe(getState(), burger)).toBe(false);
  });

  it('removes a recipe', () => {
    const { burger, salad, dispatch, getState } = setUpMealPlannerStore();

    dispatch(addRecipe(burger));
    dispatch(addRecipe(salad));
    dispatch(removeRecipe(burger));

    expect(getState().mealPlanner.recipes).toMatchObject([{ name: 'Salad' }]);
  });
});

function setUpMealPlannerStore() {
  const store = configureStore({
    reducer: mealPlannerRootReducer,
  });

  return {
    burger: recipeMother.withBasicInfo('Burger').build(),
    burgerClone: recipeMother.withBasicInfo('Burger').build(),
    salad: recipeMother.withBasicInfo('Salad').build(),
    dispatch: store.dispatch,
    getState: () => store.getState(),
  };
}
