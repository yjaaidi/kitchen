import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { createTestQueryClientWrapper } from '../testing';
import { RecipeSearch } from './recipe-search';

describe(RecipeSearch.name, () => {
  it('shows all recipes', async () => {
    await setUp();

    await expect
      .element(page.getByRole('heading').nth(0))
      .toHaveTextContent('Burger');

    await expect
      .element(page.getByRole('heading').nth(1))
      .toHaveTextContent('Salad');
  });
});

async function setUp() {
  return await render(<RecipeSearch />, {
    wrapper: createTestQueryClientWrapper(),
  });
}
