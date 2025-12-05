import { lastValueFrom } from 'rxjs';
import { expect, it } from 'vitest';
import { MealRepositoryDef } from './meal-repository';
import { recipeMother } from '../testing/recipe.mother';

export const verifyMealRepositoryContract = (
  createMealRepository: CreateMealRepository
) => {
  const burger = recipeMother.withBasicInfo('Burger').build();
  const salad = recipeMother.withBasicInfo('Salad').build();

  it('adds recipes', async () => {
    const { mealRepo } = createMealRepository();

    await lastValueFrom(mealRepo.addMeal(burger));
    await lastValueFrom(mealRepo.addMeal(salad));

    expect(await lastValueFrom(mealRepo.getMeals())).toEqual([
      expect.objectContaining({ name: 'Burger' }),
      expect.objectContaining({ name: 'Salad' }),
    ]);
  });

  it('returns empty array initially', async () => {
    const { mealRepo } = createMealRepository();

    expect(await lastValueFrom(mealRepo.getMeals())).toEqual([]);
  });
};

type CreateMealRepository = () => {
  mealRepo: MealRepositoryDef;
};
