import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecipeFilterForm } from './recipe-filter-form';
import { RecipeFilter } from './recipe-filter';

describe(RecipeFilterForm, () => {
  it.todo('shows filter values from props', async () => {
    throw new Error('🚧 Work in progress!');
  });

  it.todo('shows empty inputs when filter fields are undefined', async () => {
    throw new Error('🚧 Work in progress!');
  });

  it.todo(
    'calls onFilterChange with merged keywords as the user types',
    async () => {
      throw new Error('🚧 Work in progress!');
    },
  );

  it.todo(
    'calls onFilterChange with numeric maxIngredientCount and preserves other fields',
    async () => {
      throw new Error('🚧 Work in progress!');
    },
  );

  it.todo(
    'sets maxIngredientCount to undefined when the field is cleared',
    async () => {
      throw new Error('🚧 Work in progress!');
    },
  );

  it.todo('sets keywords to undefined when the field is cleared', async () => {
    throw new Error('🚧 Work in progress!');
  });
});
