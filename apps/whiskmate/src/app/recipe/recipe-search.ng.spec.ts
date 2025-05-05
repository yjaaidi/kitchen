import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, Mocked, vi } from 'vitest';
import RecipeSearch from './recipe-search.ng';
import { RecipeRepository, RecipeRepositoryDef } from './recipe-repository';
import { of } from 'rxjs';
import { recipeMother } from '../testing/recipe.mother';

describe(RecipeSearch.name, () => {
  it('should search recipes without filtering', async () => {
    const { findRecipeTitles, repo } = await renderComponent();

    const els = await findRecipeTitles();
    expect.soft(els).toHaveLength(2);
    expect.soft(els[0]).toHaveTextContent('Burger');
    expect.soft(els[1]).toHaveTextContent('Salad');

    expect(repo.search).toHaveBeenCalledExactlyOnceWith(undefined);
  });

  it('should filter recipes using keywords', async () => {
    const { findRecipeTitles, typeKeywords, burger, repo } =
      await renderComponent();

    repo.search.mockClear();
    repo.search.mockReturnValue(of([burger]));

    await typeKeywords('Bur');

    await vi.waitFor(async () => {
      const els = await findRecipeTitles();
      expect(els).toHaveLength(1);
      expect(els[0]).toHaveTextContent('Burger');
    });

    expect(repo.search).toHaveBeenCalledExactlyOnceWith('Bur');
  });

  async function renderComponent() {
    const burger = recipeMother.withBasicInfo('Burger').build();
    const salad = recipeMother.withBasicInfo('Salad').build();

    const repo: Mocked<RecipeRepositoryDef> = {
      search: vi.fn(),
    };

    repo.search.mockReturnValue(of([burger, salad]));

    await render(RecipeSearch, {
      providers: [{ provide: RecipeRepository, useValue: repo }],
    });

    return {
      burger,
      repo,
      async findRecipeTitles() {
        return screen.findAllByRole('heading', { level: 2 });
      },
      async typeKeywords(keywords: string) {
        await userEvent.type(screen.getByLabelText('Keywords'), keywords);
      },
    };
  }
});
