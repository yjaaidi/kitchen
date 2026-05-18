import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecipeFilterForm } from './recipe-filter-form';
import { RecipeFilter } from './recipe-filter';

describe(RecipeFilterForm, () => {
  it.todo('pre-fills the form with the filter from props', async () => {
    throw new Error('🚧 Work in progress!');
  });

  it.todo('calls onFilterChange with new filter when user types', async () => {
    throw new Error('🚧 Work in progress!');
  });
});
