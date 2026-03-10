import { TestBed } from '@angular/core/testing';
import { RecipeRepository } from './recipe-repository';
import { applyRecipeRepositoryContract } from './recipe-repository.contract';
import { describe } from 'vitest';

describe(RecipeRepository.name, () => {
  applyRecipeRepositoryContract(async () => ({
    repository: TestBed.inject(RecipeRepository),
  }));
});
