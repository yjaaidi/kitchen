import { describe, expect, it, vi } from 'vitest';
import { outputBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { RecipeFilter } from './recipe-filter.ng';

describe(RecipeFilter.name, () => {
  it('filters recipes', async () => {
    const { filterChangeSpy, keywordsInput } = mountRecipeFilter();

    await keywordsInput.fill('Bur');

    expect(filterChangeSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ keywords: 'Bur' }),
    );
  });
});

function mountRecipeFilter() {
  const filterChangeSpy = vi.fn();
  TestBed.createComponent(RecipeFilter, {
    bindings: [outputBinding('filterChange', filterChangeSpy)],
  });

  return {
    filterChangeSpy,
    keywordsInput: page.getByRole('textbox', { name: 'Keywords' }),
  };
}
