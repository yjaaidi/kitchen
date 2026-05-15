import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecipeFilter } from './recipe-filter';

describe(RecipeFilter, () => {
  it('shows filter values from props', () => {
    render(
      <RecipeFilter
        filter={{
          keywords: 'pasta',
          maxIngredientCount: 5,
          maxStepCount: 10,
        }}
        onFilterChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Keywords')).toHaveValue('pasta');
    expect(screen.getByLabelText('Max Ingredients')).toHaveValue(5);
    expect(screen.getByLabelText('Max Steps')).toHaveValue(10);
  });

  it('shows empty inputs when filter fields are undefined', () => {
    render(<RecipeFilter filter={{}} onFilterChange={vi.fn()} />);

    expect(screen.getByLabelText('Keywords')).toHaveValue('');
    expect(screen.getByLabelText('Max Ingredients')).toHaveValue(null);
    expect(screen.getByLabelText('Max Steps')).toHaveValue(null);
  });

  it('calls onFilterChange with merged keywords as the user types', async () => {
    const onFilterChange = vi.fn();
    render(<RecipeFilter filter={{}} onFilterChange={onFilterChange} />);

    await userEvent.type(screen.getByLabelText('Keywords'), 'soup');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'soup',
    });
  });

  it('calls onFilterChange with numeric maxIngredientCount and preserves other fields', async () => {
    const onFilterChange = vi.fn();
    render(
      <RecipeFilter
        filter={{ keywords: 'pie' }}
        onFilterChange={onFilterChange}
      />,
    );

    await userEvent.type(screen.getByLabelText('Max Ingredients'), '7');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'pie',
      maxIngredientCount: 7,
    });
  });

  it('sets maxIngredientCount to undefined when the field is cleared', async () => {
    const onFilterChange = vi.fn();
    render(
      <RecipeFilter
        filter={{ maxIngredientCount: 4 }}
        onFilterChange={onFilterChange}
      />,
    );

    await userEvent.clear(screen.getByLabelText('Max Ingredients'));

    expect(onFilterChange).toHaveBeenLastCalledWith({
      maxIngredientCount: undefined,
    });
  });

  it('sets keywords to undefined when the field is cleared', async () => {
    const onFilterChange = vi.fn();
    render(
      <RecipeFilter
        filter={{ keywords: 'toast' }}
        onFilterChange={onFilterChange}
      />,
    );

    await userEvent.clear(screen.getByLabelText('Keywords'));

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: undefined,
    });
  });
});
