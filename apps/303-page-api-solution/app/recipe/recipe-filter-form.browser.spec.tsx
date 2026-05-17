import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form';

describe(RecipeFilterForm, () => {
  it('shows filter values from props', async () => {
    const { keywordsInput, maxIngredientsInput, maxStepsInput } =
      await mountRecipeFilterForm({
        filter: { keywords: 'pasta', maxIngredientCount: 5, maxStepCount: 10 },
      });

    await expect.element(keywordsInput).toHaveValue('pasta');
    await expect.element(maxIngredientsInput).toHaveValue(5);
    await expect.element(maxStepsInput).toHaveValue(10);
  });

  it('shows empty inputs when filter fields are undefined', async () => {
    const { keywordsInput, maxIngredientsInput, maxStepsInput } =
      await mountRecipeFilterForm();

    await expect.element(keywordsInput).toHaveValue('');
    await expect.element(maxIngredientsInput).toHaveValue(null);
    await expect.element(maxStepsInput).toHaveValue(null);
  });

  it('calls onFilterChange with merged keywords as the user types', async () => {
    const { onFilterChange, keywordsInput } = await mountRecipeFilterForm();

    await keywordsInput.fill('soup');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'soup',
    });
  });

  it('calls onFilterChange with numeric maxIngredientCount and preserves other fields', async () => {
    const { maxIngredientsInput, onFilterChange } = await mountRecipeFilterForm(
      {
        filter: { keywords: 'pie' },
      },
    );

    await maxIngredientsInput.fill('7');

    expect(onFilterChange).toHaveBeenLastCalledWith({
      keywords: 'pie',
      maxIngredientCount: 7,
    });
  });

  it('sets maxIngredientCount to undefined when the field is cleared', async () => {
    const { maxIngredientsInput, onFilterChange } = await mountRecipeFilterForm(
      { filter: { maxIngredientCount: 4 } },
    );

    await maxIngredientsInput.clear();

    expect(onFilterChange).toHaveBeenLastCalledWith({
      maxIngredientCount: undefined,
    });
  });

  it('sets keywords to undefined when the field is cleared', async () => {
    const { keywordsInput, onFilterChange } = await mountRecipeFilterForm({
      filter: { keywords: 'toast' },
    });

    await keywordsInput.clear();

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

  return {
    onFilterChange,
    keywordsInput: page.getByLabelText('Keywords'),
    maxIngredientsInput: page.getByLabelText('Max Ingredients'),
    maxStepsInput: page.getByLabelText('Max Steps'),
  };
}
