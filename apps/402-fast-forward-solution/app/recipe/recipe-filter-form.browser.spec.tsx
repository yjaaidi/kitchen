import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setUpTimeMachine } from '../testing/time-machine';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form';

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

    await expect
      .poll(() => onFilterChange)
      .toHaveBeenLastCalledWith({ keywords: 'soup' });
  });

  it('does not call onFilterChange before debounce delay', async () => {
    const { onFilterChange, timeMachine } = mountRecipeFilterForm();

    timeMachine.pause();

    await userEvent.type(screen.getByLabelText('Keywords'), 'soup', {
      delay: null,
    });

    await timeMachine.seek(90);

    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it('calls onFilterChange after debounce delay', async () => {
    const { onFilterChange, timeMachine } = mountRecipeFilterForm();

    timeMachine.pause();

    await userEvent.type(screen.getByLabelText('Keywords'), 'soup', {
      delay: null,
    });

    await timeMachine.seek(110);

    expect(onFilterChange).toHaveBeenCalledExactlyOnceWith({
      keywords: 'soup',
    });
  });

  it('calls onFilterChange with numeric maxIngredientCount and preserves other fields', async () => {
    const { onFilterChange } = mountRecipeFilterForm({
      filter: { keywords: 'pie' },
    });

    await userEvent.type(screen.getByLabelText('Max Ingredients'), '7');

    await expect
      .poll(() => onFilterChange)
      .toHaveBeenLastCalledWith({ keywords: 'pie', maxIngredientCount: 7 });
  });

  it('sets maxIngredientCount to undefined when the field is cleared', async () => {
    const { onFilterChange } = mountRecipeFilterForm({
      filter: { maxIngredientCount: 4 },
    });

    await userEvent.clear(screen.getByLabelText('Max Ingredients'));

    await expect
      .poll(() => onFilterChange)
      .toHaveBeenLastCalledWith({ maxIngredientCount: undefined });
  });

  it('sets keywords to undefined when the field is cleared', async () => {
    const { onFilterChange } = mountRecipeFilterForm({
      filter: { keywords: 'toast' },
    });

    await userEvent.clear(screen.getByLabelText('Keywords'));

    await expect
      .poll(() => onFilterChange)
      .toHaveBeenLastCalledWith({ keywords: undefined });
  });
});

function mountRecipeFilterForm({
  filter = {},
}: { filter?: RecipeFilter } = {}) {
  const timeMachine = setUpTimeMachine();
  timeMachine.fastForward();

  const onFilterChange = vi.fn<(recipeFilter: RecipeFilter) => void>();
  render(<RecipeFilterForm filter={filter} onFilterChange={onFilterChange} />);
  return { onFilterChange, timeMachine };
}
