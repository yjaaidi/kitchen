import { CatalogPaginationWindow } from '../shared/catalog-pagination';

export interface RecipeSearchPaginationState extends CatalogPaginationWindow {}

export const DEFAULT_RECIPE_SEARCH_PAGE_LIMIT = 5;

export function createRecipeSearchPaginationState(
  partial?: Partial<RecipeSearchPaginationState>,
): RecipeSearchPaginationState {
  return {
    offset: 0,
    limit: DEFAULT_RECIPE_SEARCH_PAGE_LIMIT,
    ...partial,
  };
}
