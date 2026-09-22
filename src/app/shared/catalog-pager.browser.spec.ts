import { describe, it } from 'vitest';
import { CatalogPager } from './catalog-pager.ng';

describe(CatalogPager.name, () => {
  it.todo('disables previous at offset zero', () => {
    // Mount with offset: 0, limit: 5, total: 10.
    // Assert Previous is disabled and Next is enabled.
  });

  it.todo('disables next on the last page', () => {
    // Mount with offset: 5, limit: 5, total: 6.
    // Assert Next is disabled and Previous is enabled.
  });

  it.todo('emits offsetChange when next is clicked', () => {
    // Mount with offset: 0, limit: 5, total: 10.
    // Click Next.
    // Assert offsetChange emitted with 5.
  });
});
