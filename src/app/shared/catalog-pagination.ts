export interface CatalogPaginationWindow {
  offset: number;
  limit: number;
}

export interface CatalogPaginationContext extends CatalogPaginationWindow {
  total: number;
}

export function sliceCatalogPage<T>(
  items: readonly T[],
  window: CatalogPaginationWindow,
): T[] {
  return items.slice(window.offset, window.offset + window.limit);
}
