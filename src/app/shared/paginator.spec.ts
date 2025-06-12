import { describe, it } from 'vitest';

describe('RecipePaginator', () => {
  it.todo('Disables previous button on first page', () => {
    // Mount the paginator with offset 0 and limit 5, and total 7
    // Assert the previous button is disabled
  });

  it.todo('Disables next button on last page', () => {
    // Mount the paginator with offset 5, limit 5, and total 7
    // Assert the next button is disabled
  });

  it.todo('Emits offsetChange when next is clicked', () => {
    // Mount the paginator with offset 0, limit 5, and total 7
    // Click the next button
    // Assert offsetChange is emitted with value 5
  });

  it.todo('Emits offsetChange when previous is clicked', () => {
    // Mount the paginator with offset 5, limit 5, and total 7
    // Click the previous button
    // Assert offsetChange is emitted with value 0
  });
});
