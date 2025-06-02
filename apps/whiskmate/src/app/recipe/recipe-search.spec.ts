import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RecipeSearch from './recipe-search.ng';

describe(RecipeSearch.name, () => {
  it.todo('🚧 should search recipes without filtering');

  it.todo('🚧 should filter recipes using keywords');

  async function renderComponent() {
    await render(RecipeSearch);

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
