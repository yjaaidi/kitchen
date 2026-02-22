import { describe, expect, it, onTestFinished } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { singletonTestingUtils } from '../shared/singleton';
import { createTestQueryClientWrapper } from '../testing';
import { recipeRepositorySingleton } from './recipe-repository';
import { RecipeRepositoryFake } from './recipe-repository.fake';
import { RecipeSearch } from './recipe-search';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch.name, () => {
  it('shows all recipes', async () => {
    const { headings } = await setUp();

    await expect.element(headings).toHaveLength(2);
    await expect.element(headings.nth(0)).toHaveTextContent('Burger');
    await expect.element(headings.nth(1)).toHaveTextContent('Salad');
  });

  it('filter recipes', async () => {
    const { headings, keywordsInput: keywords } = await setUp();

    await keywords.fill('Salad');

    await expect.element(headings).toHaveTextContent('Salad');
  });
});

async function setUp() {
  singletonTestingUtils.override(recipeRepositorySingleton, () => {
    const fake = new RecipeRepositoryFake();
    fake.configure({
      recipes: [
        recipeMother.withBasicInfo('Burger').build(),
        recipeMother.withBasicInfo('Salad').build(),
      ],
    });
    return fake;
  });

  await render(<RecipeSearch />, {
    wrapper: createTestQueryClientWrapper(),
  });

  onTestFinished(() => {
    singletonTestingUtils.reset();
  });

  return {
    keywordsInput: page.getByLabelText('Keywords'),
    headings: page.getByRole('heading'),
  };
}
