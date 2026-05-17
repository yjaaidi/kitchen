import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form';

describe(RecipeFilterForm, () => {
  it('shows filter values from props', async () => {
    const { getInput } = await mountRecipeFilterForm({
      filter: { keywords: 'pasta', maxIngredientCount: 5, maxStepCount: 10 },
    });

    expect(getInput('Keywords')).toHaveValue('pasta');
    expect(getInput('Max Ingredients')).toHaveValue(5);
    expect(getInput('Max Steps')).toHaveValue(10);
  });

  it('shows empty inputs when filter fields are undefined', async () => {
    const { getInput } = await mountRecipeFilterForm();

    expect(getInput('Keywords')).toHaveValue('');
    expect(getInput('Max Ingredients')).toHaveValue(null);
    expect(getInput('Max Steps')).toHaveValue(null);
  });

  it('calls onFilterChange with merged keywords as the user types', async () => {
    const { onFilterChange, fillInput } = await mountRecipeFilterForm();

    await fillInput('Keywords', 'soup');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'soup',
    });
  });

  it('calls onFilterChange with numeric maxIngredientCount and preserves other fields', async () => {
    const { fillInput, onFilterChange } = await mountRecipeFilterForm({
      filter: { keywords: 'pie' },
    });

    await fillInput('Max Ingredients', '7');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'pie',
      maxIngredientCount: 7,
    });
  });

  it('sets maxIngredientCount to undefined when the field is cleared', async () => {
    const { clearInput, onFilterChange } = await mountRecipeFilterForm({
      filter: { maxIngredientCount: 4 },
    });

    await clearInput('Max Ingredients');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      maxIngredientCount: undefined,
    });
  });

  it('sets keywords to undefined when the field is cleared', async () => {
    const { clearInput, onFilterChange } = await mountRecipeFilterForm({
      filter: { keywords: 'toast' },
    });

    await clearInput('Keywords');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: undefined,
    });
  });
});

async function mountRecipeFilterForm({
  filter = {},
}: { filter?: RecipeFilter } = {}) {
  const onFilterChange = vi.fn<(recipeFilter: RecipeFilter) => void>();

  await render(
    <RecipeFilterForm filter={filter} onFilterChange={onFilterChange} />,
  );

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
