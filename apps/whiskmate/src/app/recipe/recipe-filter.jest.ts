import { outputBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { RecipeFilter } from './recipe-filter.ng';

describe(RecipeFilter.name, () => {
  it('filters recipes', async () => {
    const { filterChangeSpy, keywordsInput: findKeywordsInput } =
      mountRecipeFilter();

    await userEvent.type(await findKeywordsInput(), 'Bur');

    await waitFor(() => {
      expect(filterChangeSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ keywords: 'Bur' }),
      );
    });
  });
});

function mountRecipeFilter() {
  const filterChangeSpy = jest.fn();
  TestBed.createComponent(RecipeFilter, {
    bindings: [outputBinding('filterChange', filterChangeSpy)],
  });

  return {
    filterChangeSpy,
    async keywordsInput() {
      return screen.findByRole('textbox', { name: 'Keywords' });
    },
  };
}
