import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { setUpTimeMachine } from '../testing/time-machine';
import { RecipeFilter } from './recipe-filter';
import { RecipeFilterForm } from './recipe-filter-form';

describe(RecipeFilterForm, () => {
  it('pre-fills the form with the filter from props', async () => {
    const { keywordsInput, maxIngredientsInput, maxStepsInput } =
      await mountRecipeFilterForm({
        filter: { keywords: 'pasta', maxIngredientCount: 5, maxStepCount: 10 },
      });

    await expect.element(keywordsInput).toHaveValue('pasta');
    await expect.element(maxIngredientsInput).toHaveValue(5);
    await expect.element(maxStepsInput).toHaveValue(10);
  });

  it('calls onFilterChange with new filter when user types', async () => {
    const { onFilterChange, keywordsInput } = await mountRecipeFilterForm();

    await keywordsInput.fill('soup');

    await expect
      .poll(() => onFilterChange)
      .toHaveBeenLastCalledWith({ keywords: 'soup' });
  });

  it('does not call onFilterChange before debounce delay', async () => {
    const timeMachine = setUpTimeMachine();
    const { onFilterChange, keywordsInput } = await mountRecipeFilterForm();

    timeMachine.pause();

    await keywordsInput.fill('soup');

    await timeMachine.seek(190);

    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it('calls onFilterChange after debounce delay', async () => {
    const timeMachine = setUpTimeMachine();
    const { onFilterChange, keywordsInput } = await mountRecipeFilterForm();

    await keywordsInput.fill('soup');

    await timeMachine.seek(210);

    expect(onFilterChange).toHaveBeenCalledExactlyOnceWith({
      keywords: 'soup',
    });
  });

  it('calls onFilterChange with new filter when user types and merges it with the filter from props', async () => {
    const { maxIngredientsInput, onFilterChange } = await mountRecipeFilterForm(
      {
        filter: { keywords: 'pie' },
      },
    );

    await maxIngredientsInput.fill('7');

    await expect
      .poll(() => onFilterChange)
      .toHaveBeenLastCalledWith({ keywords: 'pie', maxIngredientCount: 7 });
  });

  it('sets maxIngredientCount to undefined when the field is cleared', async () => {
    const { maxIngredientsInput, onFilterChange } = await mountRecipeFilterForm(
      { filter: { maxIngredientCount: 4 } },
    );

    await maxIngredientsInput.clear();

    await expect
      .poll(() => onFilterChange)
      .toHaveBeenLastCalledWith({ maxIngredientCount: undefined });
  });

  it('sets keywords to undefined when the field is cleared', async () => {
    const { keywordsInput, onFilterChange } = await mountRecipeFilterForm({
      filter: { keywords: 'toast' },
    });

    await keywordsInput.clear();

    await expect
      .poll(() => onFilterChange)
      .toHaveBeenLastCalledWith({ keywords: undefined });
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
