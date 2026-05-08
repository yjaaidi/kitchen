# Contract: RecipeSearch Component (modified)

**File**: `src/app/recipe/recipe-search.ng.ts`  
**Selector**: `wm-recipe-search`

## External API (no change)

This component has no `@Input()` or `@Output()` — its public interface is unchanged. The pagination feature is entirely internal.

## Internal State Changes (summary for reviewers)

| Signal | Was | Now |
|---|---|---|
| `filter` | `signal<RecipeFilter>({})` | Unchanged |
| `recipes` (rxResource) | renamed to `allRecipes`; same shape | Renamed for clarity |
| `currentPage` | — | New `linkedSignal` (0-indexed, resets on filter change) |
| `paginatedRecipes` | — | New `computed` — slice of `allRecipes.value()` |
| `totalPages` | — | New `computed` |

## Template Changes

| Area | Change |
|---|---|
| `@for` loop | Iterates `paginatedRecipes()` instead of `recipes.value()` |
| Error block | `@if (allRecipes.error())` → shows error message + Retry button |
| Loading indicator | `@if (allRecipes.isLoading())` → shows loading spinner/indicator |
| Paginator | `<wm-paginator>` added below catalog |

## Retry Behaviour

Clicking "Retry" calls `allRecipes.reload()`. `currentPage` is NOT reset — the user retries the same page they were on.
