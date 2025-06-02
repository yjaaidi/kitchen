import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RecipeSearch from './recipe-search.ng';
import { of } from 'rxjs';
import { recipeMother } from '../testing/recipe.mother';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';

describe(RecipeSearch.name, () => {
  it('should search recipes without filtering', async () => {
    const { findRecipeTitles } = await renderComponent();

    const els = await findRecipeTitles();
    expect.soft(els).toHaveLength(2);
    expect.soft(els[0]).toHaveTextContent('Burger');
    expect.soft(els[1]).toHaveTextContent('Salad');
  });

  it('should filter recipes using keywords', async () => {
    const { findRecipeTitles, typeKeywords } = await renderComponent();

    await typeKeywords('Bur');

    await vi.waitFor(async () => {
      const els = await findRecipeTitles();
      expect(els).toHaveLength(1);
      expect(els[0]).toHaveTextContent('Burger');
    });
  });

  async function renderComponent() {
    const burger = recipeMother.withBasicInfo('Burger').build();
    const salad = recipeMother.withBasicInfo('Salad').build();

    await render(RecipeSearch, {
      providers: [provideRecipeRepositoryFake()],
      configureTestBed(testBed) {
        testBed.inject(RecipeRepositoryFake).configure({
          recipes: [burger, salad],
        });
      },
    });

    return {
      async findRecipeTitles() {
        return screen.findAllByRole('heading', { level: 2 });
      },
      async typeKeywords(keywords: string) {
        await userEvent.type(screen.getByLabelText('Keywords'), keywords);
      },
    };
  }
});
