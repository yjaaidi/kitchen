import { verifyRecipeRepositoryContract } from './recipe-repository.contract';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { RecipeRepository } from './recipe-repository';

describe(RecipeRepository.name, () => {
  verifyRecipeRepositoryContract({
    setUp,
  });
});

function setUp() {
  TestBed.configureTestingModule({ providers: [provideHttpClient()] });
  return {
    repo: TestBed.inject(RecipeRepository),
  };
}
