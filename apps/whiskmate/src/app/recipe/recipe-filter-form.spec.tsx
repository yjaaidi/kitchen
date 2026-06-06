import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form';

afterEach(() => {
  vi.useRealTimers();
});

describe(RecipeFilterForm, () => {
  it('pre-fills the form with the filter from props', async () => {
    await mountRecipeFilterForm({
      filter: { keywords: 'pasta', maxIngredientCount: 5, maxStepCount: 10 },
    });

    expect(await screen.findByLabelText('Keywords')).toHaveValue('pasta');
    expect(await screen.findByLabelText('Max Ingredients')).toHaveValue(5);
    expect(await screen.findByLabelText('Max Steps')).toHaveValue(10);
  });

  it('calls onFilterChange with new filter when user types', async () => {
    vi.useFakeTimers();
    const { fillInput, onFilterChange } = await mountRecipeFilterForm();

    await fillInput('Keywords', 'soup');
    await act(() => vi.advanceTimersByTimeAsync(210));

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith({ keywords: 'soup' });
  });

  it('does not call onFilterChange before debounce delay', async () => {
    vi.useFakeTimers();
    const { fillInput, onFilterChange } = await mountRecipeFilterForm();

    await fillInput('Keywords', 'soup');
    await act(() => vi.advanceTimersByTimeAsync(190));

    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it('calls onFilterChange after debounce delay', async () => {
    vi.useFakeTimers();
    const { fillInput, onFilterChange } = await mountRecipeFilterForm();

    await fillInput('Keywords', 'soup');
    await act(() => vi.advanceTimersByTimeAsync(210));

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith({ keywords: 'soup' });
  });

  it('calls onFilterChange with new filter when user types and merges it with the filter from props', async () => {
    vi.useFakeTimers();
    const { fillInput, onFilterChange } = await mountRecipeFilterForm({
      filter: { keywords: 'pie' },
    });

    await fillInput('Max Ingredients', '7');
    await act(() => vi.advanceTimersByTimeAsync(210));

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith({
      keywords: 'pie',
      maxIngredientCount: 7,
    });
  });

  it('sets maxIngredientCount to undefined when the field is cleared', async () => {
    vi.useFakeTimers();
    const { clearInput, onFilterChange } = await mountRecipeFilterForm({
      filter: { maxIngredientCount: 4 },
    });

    await clearInput('Max Ingredients');
    await act(() => vi.advanceTimersByTimeAsync(210));

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith({
      maxIngredientCount: undefined,
    });
  });

  it('sets keywords to undefined when the field is cleared', async () => {
    vi.useFakeTimers();
    const { clearInput, onFilterChange } = await mountRecipeFilterForm({
      filter: { keywords: 'toast' },
    });

    await clearInput('Keywords');
    await act(() => vi.advanceTimersByTimeAsync(210));

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith({ keywords: undefined });
  });
});

async function mountRecipeFilterForm({
  filter = {},
}: { filter?: RecipeFilter } = {}) {
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTimeAsync.bind(jest),
  });

  const onFilterChange = vi.fn();

  render(<RecipeFilterForm filter={filter} onFilterChange={onFilterChange} />);

  return {
    onFilterChange,
    clearInput: async (label: 'Keywords' | 'Max Ingredients' | 'Max Steps') => {
      const input = await screen.findByLabelText(label);
      await user.clear(input);
    },
    fillInput: async (
      label: 'Keywords' | 'Max Ingredients' | 'Max Steps',
      value: string,
    ) => {
      const input = await screen.findByLabelText(label);
      await user.type(input, value);
    },
  };
}
