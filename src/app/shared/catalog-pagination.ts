export interface CatalogPaginationWindow {
  offset: number;
  limit: number;
}

export interface CatalogPaginationContext extends CatalogPaginationWindow {
  total: number;
}

/**
 * @deprecated 🚧 work in progress
 */
export function sliceCatalogPage<T>(
  items: readonly T[],
  window: CatalogPaginationWindow,
): T[] {
  throw new Error(`🚧 work in progress`);
}
