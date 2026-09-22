export interface CatalogPaginationWindow {
  offset: number;
  limit: number;
}

export interface CatalogPaginationContext extends CatalogPaginationWindow {
  total: number;
}
