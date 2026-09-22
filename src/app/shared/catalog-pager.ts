import { CatalogPaginationContext } from './catalog-pagination';

export interface CatalogPagerInputs extends CatalogPaginationContext {}

export type CatalogPagerOffsetChange = number;

export interface CatalogPagerOutputs {
  offsetChange: CatalogPagerOffsetChange;
}

/** Documents the public binding surface of `CatalogPager`. */
export interface CatalogPagerDef extends CatalogPagerInputs, CatalogPagerOutputs {}
