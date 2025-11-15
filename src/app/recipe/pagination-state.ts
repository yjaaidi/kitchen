export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const DEFAULT_PAGE_SIZE = 12;

/**
 * Compute pagination state from total items, current page, and page size
 * Automatically clamps page number to valid range [1, totalPages]
 */
export function computePaginationState(
  totalItems: number,
  currentPage: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): PaginationState {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPage = Math.max(1, Math.min(currentPage, totalPages));

  return {
    currentPage: clampedPage,
    pageSize,
    totalItems,
    totalPages,
  };
}

/**
 * Get items for a specific page from an array
 * Returns a slice of the array corresponding to the requested page
 */
export function getPageItems<T>(
  allItems: T[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return allItems.slice(startIndex, endIndex);
}

/**
 * Determine if pagination controls should be shown
 * Returns true if there are more items than fit on a single page
 */
export function shouldShowPagination(
  totalItems: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): boolean {
  return totalItems > pageSize;
}
