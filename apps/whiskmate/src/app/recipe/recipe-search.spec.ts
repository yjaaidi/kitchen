import { describe, expect, it } from 'vitest';
import { RecipeSearch } from './recipe-search.ng';
import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';

describe(RecipeSearch, () => {
  it.todo('loads recipes', async () => {
    TestBed.createComponent(RecipeSearch);
    // Assert that Burger is the only recipe displayed.
  });
});
