import { describe } from 'node:test';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';
import { applyRecipeRepositoryContract } from './recipe-repository.contract';
import { TestBed } from '@angular/core/testing';
import { recipeMother } from '../recipe.mother';

describe(RecipeRepositoryFake.name, () => {
  applyRecipeRepositoryContract(async () => {
    TestBed.configureTestingModule({
      providers: [provideRecipeRepositoryFake()],
    });
    const repository = TestBed.inject(RecipeRepositoryFake);

    repository.setRecipes([
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ]);

    return {
      repository,
    };
  });
});
