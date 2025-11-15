import { describe, it, expect } from 'vitest';
import {
  computePaginationState,
  getPageItems,
  shouldShowPagination,
  DEFAULT_PAGE_SIZE,
} from './pagination-state';

describe('computePaginationState', () => {
  it('should calculate correct pagination for 50 items with 12 per page', () => {
    const state = computePaginationState(50, 1, 12);

    expect(state).toEqual({
      currentPage: 1,
      pageSize: 12,
      totalItems: 50,
      totalPages: 5, // ceil(50/12) = 5
    });
  });

  it('should calculate correct pagination for 25 items with default page size', () => {
    const state = computePaginationState(25, 2);

    expect(state).toEqual({
      currentPage: 2,
      pageSize: DEFAULT_PAGE_SIZE,
      totalItems: 25,
      totalPages: 3, // ceil(25/12) = 3
    });
  });

  it('should clamp page number to maximum when exceeding total pages', () => {
    const state = computePaginationState(50, 99, 12);

    expect(state.currentPage).toBe(5); // Max page for 50 items
    expect(state.totalPages).toBe(5);
  });

  it('should clamp page number to minimum when less than 1', () => {
    const state = computePaginationState(50, 0, 12);

    expect(state.currentPage).toBe(1);
  });

  it('should handle negative page numbers', () => {
    const state = computePaginationState(50, -5, 12);

    expect(state.currentPage).toBe(1);
  });

  it('should handle empty results with at least 1 page', () => {
    const state = computePaginationState(0, 1, 12);

    expect(state.totalPages).toBe(1);
    expect(state.currentPage).toBe(1);
    expect(state.totalItems).toBe(0);
  });

  it('should handle exactly one page of results', () => {
    const state = computePaginationState(12, 1, 12);

    expect(state).toEqual({
      currentPage: 1,
      pageSize: 12,
      totalItems: 12,
      totalPages: 1,
    });
  });

  it('should handle one more than a full page', () => {
    const state = computePaginationState(13, 1, 12);

    expect(state.totalPages).toBe(2); // ceil(13/12) = 2
  });
});

describe('getPageItems', () => {
  const items = Array.from({ length: 50 }, (_, i) => ({
    id: `item-${i}`,
    index: i,
  }));

  it('should return first page items', () => {
    const page1 = getPageItems(items, 1, 12);

    expect(page1).toHaveLength(12);
    expect(page1[0].index).toBe(0);
    expect(page1[11].index).toBe(11);
  });

  it('should return second page items', () => {
    const page2 = getPageItems(items, 2, 12);

    expect(page2).toHaveLength(12);
    expect(page2[0].index).toBe(12);
    expect(page2[11].index).toBe(23);
  });

  it('should return last page items with fewer than page size', () => {
    const page5 = getPageItems(items, 5, 12);

    expect(page5).toHaveLength(2); // 50 - (4 * 12) = 2
    expect(page5[0].index).toBe(48);
    expect(page5[1].index).toBe(49);
  });

  it('should return empty array for page beyond total items', () => {
    const page10 = getPageItems(items, 10, 12);

    expect(page10).toHaveLength(0);
  });

  it('should return all items if total items less than page size', () => {
    const smallList = items.slice(0, 8);
    const page1 = getPageItems(smallList, 1, 12);

    expect(page1).toHaveLength(8);
  });

  it('should work with default page size', () => {
    const page1 = getPageItems(items, 1);

    expect(page1).toHaveLength(DEFAULT_PAGE_SIZE);
  });

  it('should return empty array for empty input', () => {
    const page1 = getPageItems([], 1, 12);

    expect(page1).toHaveLength(0);
  });
});

describe('shouldShowPagination', () => {
  it('should return true when items exceed page size', () => {
    expect(shouldShowPagination(13, 12)).toBe(true);
    expect(shouldShowPagination(50, 12)).toBe(true);
    expect(shouldShowPagination(100, 12)).toBe(true);
  });

  it('should return false when items equal page size', () => {
    expect(shouldShowPagination(12, 12)).toBe(false);
  });

  it('should return false when items less than page size', () => {
    expect(shouldShowPagination(11, 12)).toBe(false);
    expect(shouldShowPagination(1, 12)).toBe(false);
    expect(shouldShowPagination(0, 12)).toBe(false);
  });

  it('should work with default page size', () => {
    expect(shouldShowPagination(13)).toBe(true);
    expect(shouldShowPagination(12)).toBe(false);
  });
});

