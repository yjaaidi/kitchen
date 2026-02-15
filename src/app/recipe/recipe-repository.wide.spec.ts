import { describe, it } from 'vitest';
import { RecipeRepository } from './recipe-repository';

describe(RecipeRepository.name, () => {
  it.todo('returns paginated results', () => {
    // Call search({ offset: 0, limit: 2 }).
    // Assert response has recipes (array of length <= 2) and total is a number >= 0.
  });

  it.todo('second page returns different recipes', () => {
    // Call search({ offset: 0, limit: 2 }) then search({ offset: 2, limit: 2 }).
    // Assert the two pages return different recipe IDs.
  });

  it.todo('offset beyond total returns empty', () => {
    // Call search({ offset: 0, limit: 1 }) to get total.
    // Call search({ offset: total, limit: 1 }).
    // Assert recipes is empty.
  });
});
