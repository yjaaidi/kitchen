import { TestBed } from '@angular/core/testing';
import { describe } from 'vitest';
import { verifyMealRepositoryContract } from './meal-repository.contract';
import { MealRepositoryFake } from './meal-repository.fake';

describe(MealRepositoryFake.name, () => {
  verifyMealRepositoryContract(createMealRepositoryFake);

  function createMealRepositoryFake() {
    TestBed.configureTestingModule({ providers: [MealRepositoryFake] });
    return { mealRepo: TestBed.inject(MealRepositoryFake) };
  }
});
