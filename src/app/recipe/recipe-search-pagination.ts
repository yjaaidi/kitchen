import { CatalogPaginationWindow } from '../shared/catalog-pagination';

export interface RecipeSearchPaginationState extends CatalogPaginationWindow {}

export const DEFAULT_RECIPE_SEARCH_PAGE_LIMIT = 5;

/**
 * @deprecated 🚧 work in progress
 */
export function createRecipeSearchPaginationState(
  partial?: Partial<RecipeSearchPaginationState>,
): RecipeSearchPaginationState {
  throw new Error(`🚧 work in progress`);
}
