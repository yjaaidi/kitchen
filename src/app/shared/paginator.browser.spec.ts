import { describe, it } from 'vitest';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  it.todo('disables previous on first page', () => {
    // Mount `Paginator` with `offset: 0`, `limit: 5`, `total: 10`.
    // Assert Previous button is disabled.
  });

  it.todo('disables next on last page', () => {
    // Mount `Paginator` with `offset: 5`, `limit: 5`, `total: 10`.
    // Assert Next button is disabled.
  });

  it.todo('emits offsetchange when next is clicked', () => {
    // Mount `Paginator` with `offset: 0`, `limit: 5`, `total: 10` and capture `offsetChange`.
    // Click Next.
    // Assert `offsetChange` emits `5`.
  });

  it.todo('emits offsetchange when previous is clicked', () => {
    // Mount `Paginator` with `offset: 5`, `limit: 5`, `total: 10` and capture `offsetChange`.
    // Click Previous.
    // Assert `offsetChange` emits `0`.
  });
});
