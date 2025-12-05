import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';
import { LocalStorage } from '../shared/local-storage';
import { provideLocalStorageFake } from '../shared/local-storage.fake';
import { recipeMother } from '../testing/recipe.mother';
import { MealRepository } from './meal-repository';
import { verifyMealRepositoryContract } from './meal-repository.contract';

describe(MealRepository.name, () => {
  verifyMealRepositoryContract(createMealRepository);

  it('returns empty array when storage value is invalid', async () => {
    const { getMealRepo, setStorageValue } = setUpMealRepository();

    setStorageValue('invalid-value');

    /* Instantiate the repository once the storage is set up. */
    const mealRepo = getMealRepo();

    expect(await lastValueFrom(mealRepo.getMeals())).toEqual([]);
  });

  function createMealRepository() {
    const { getMealRepo, ...utils } = setUpMealRepository();
    return {
      ...utils,
      mealRepo: getMealRepo(),
    };
  }

  function setUpMealRepository() {
    TestBed.configureTestingModule({
      providers: [provideLocalStorageFake()],
    });

    const burger = recipeMother.withBasicInfo('Burger').build();
    const salad = recipeMother.withBasicInfo('Salad').build();

    return {
      burger,
      salad,
      getMealRepo() {
        return TestBed.inject(MealRepository);
      },
      setStorageValue(value: string) {
        TestBed.inject(LocalStorage).setItem('meals', value);
      },
    };
  }
});
