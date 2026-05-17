import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecipeFilterForm } from './recipe-filter-form';
import { RecipeFilter } from './recipe-filter';

describe(RecipeFilterForm, () => {
  it('shows filter values from props', () => {
    mountRecipeFilterForm({
      filter: { keywords: 'pasta', maxIngredientCount: 5, maxStepCount: 10 },
    });

    expect(screen.getByLabelText('Keywords')).toHaveValue('pasta');
    expect(screen.getByLabelText('Max Ingredients')).toHaveValue(5);
    expect(screen.getByLabelText('Max Steps')).toHaveValue(10);
  });

  it('shows empty inputs when filter fields are undefined', () => {
    mountRecipeFilterForm();

    expect(screen.getByLabelText('Keywords')).toHaveValue('');
    expect(screen.getByLabelText('Max Ingredients')).toHaveValue(null);
    expect(screen.getByLabelText('Max Steps')).toHaveValue(null);
  });

  it('calls onFilterChange with merged keywords as the user types', async () => {
    const { onFilterChange } = mountRecipeFilterForm();

    await userEvent.type(screen.getByLabelText('Keywords'), 'soup');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'soup',
    });
  });

  it('calls onFilterChange with numeric maxIngredientCount and preserves other fields', async () => {
    const { onFilterChange } = mountRecipeFilterForm({
      filter: { keywords: 'pie' },
    });

    await userEvent.type(screen.getByLabelText('Max Ingredients'), '7');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'pie',
      maxIngredientCount: 7,
    });
  });

  it('sets maxIngredientCount to undefined when the field is cleared', async () => {
    const { onFilterChange } = mountRecipeFilterForm({
      filter: { maxIngredientCount: 4 },
    });

    await userEvent.clear(screen.getByLabelText('Max Ingredients'));

    expect(onFilterChange).toHaveBeenLastCalledWith({
      maxIngredientCount: undefined,
    });
  });

  it('sets keywords to undefined when the field is cleared', async () => {
    const { onFilterChange } = mountRecipeFilterForm({
      filter: { keywords: 'toast' },
    });

    await userEvent.clear(screen.getByLabelText('Keywords'));

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
  return { onFilterChange };
}
