import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { outputBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { setUpTimeMachine } from '../testing/time-machine';
import { RecipeFilter } from './recipe-filter.ng';

describe(RecipeFilter.name, () => {
  it('filters recipes', async () => {
    const { filterChangeSpy, keywordsInput, timeMachine } = mountRecipeFilter();

    await timeMachine.flush();

    await keywordsInput.fill('Bur');

    await timeMachine.seek(290);

    expect.soft(filterChangeSpy).not.toHaveBeenCalled();

    await timeMachine.seek(20);

    expect
      .soft(filterChangeSpy)
      .toHaveBeenLastCalledWith(expect.objectContaining({ keywords: 'Bur' }));
  });
});

function mountRecipeFilter() {
  const filterChangeSpy = vi.fn();
  const timeMachine = setUpTimeMachine();

  vi.useFakeTimers();
  onTestFinished(() => {
    vi.useRealTimers();
  });

  TestBed.createComponent(RecipeFilter, {
    bindings: [outputBinding('filterChange', filterChangeSpy)],
  });

  return {
    filterChangeSpy,
    keywordsInput: page.getByRole('textbox', { name: 'Keywords' }),
    timeMachine,
  };
}
