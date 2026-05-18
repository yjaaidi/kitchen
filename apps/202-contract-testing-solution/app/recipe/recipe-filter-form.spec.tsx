import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecipeFilterForm } from './recipe-filter-form';
import { RecipeFilter } from './recipe-filter';

describe(RecipeFilterForm, () => {
  it('pre-fills the form with the filter from props', () => {
    const { getInput } = mountRecipeFilterForm({
      filter: { keywords: 'pasta', maxIngredientCount: 5, maxStepCount: 10 },
    });

    expect(getInput('Keywords')).toHaveValue('pasta');
    expect(getInput('Max Ingredients')).toHaveValue(5);
    expect(getInput('Max Steps')).toHaveValue(10);
  });

  it('calls onFilterChange with new filter when user types', async () => {
    const { onFilterChange, fillInput } = mountRecipeFilterForm();

    await fillInput('Keywords', 'soup');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'soup',
    });
  });

  it('calls onFilterChange with new filter when user types and merges it with the filter from props', async () => {
    const { fillInput, onFilterChange } = mountRecipeFilterForm({
      filter: { keywords: 'pie' },
    });

    await fillInput('Max Ingredients', '7');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'pie',
      maxIngredientCount: 7,
    });
  });

  it('sets maxIngredientCount to undefined when the field is cleared', async () => {
    const { clearInput, onFilterChange } = mountRecipeFilterForm({
      filter: { maxIngredientCount: 4 },
    });

    await clearInput('Max Ingredients');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      maxIngredientCount: undefined,
    });
  });

  it('sets keywords to undefined when the field is cleared', async () => {
    const { clearInput, onFilterChange } = mountRecipeFilterForm({
      filter: { keywords: 'toast' },
    });

    await clearInput('Keywords');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: undefined,
    });
  });
});

function mountRecipeFilterForm({
  filter = {},
}: { filter?: RecipeFilter } = {}) {
  const onFilterChange = vi.fn<(recipeFilter: RecipeFilter) => void>();

  render(<RecipeFilterForm filter={filter} onFilterChange={onFilterChange} />);

  const clearInput = (label: FilterInputLabel) =>
    userEvent.clear(getInput(label));
  const getInput = (label: FilterInputLabel) => screen.getByLabelText(label);

  return {
    onFilterChange,
    getInput,
    clearInput,
    fillInput: async (label: FilterInputLabel, text: string) => {
      await clearInput(label);
      await userEvent.type(getInput(label), text);
    },
  };
}

type FilterInputLabel = 'Keywords' | 'Max Ingredients' | 'Max Steps';
