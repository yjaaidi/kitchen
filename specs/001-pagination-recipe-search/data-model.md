# Data Model: Paginated Recipe Search

## Existing Entities (unchanged)

### RecipeFilter
```typescript
// src/app/recipe/recipe-filter.ts (no changes needed)
interface RecipeFilter {
  keywords?: string;
  maxIngredientCount?: number;
  maxStepCount?: number;
}
```

### Recipe
No changes.

---

## New / Modified State in RecipeSearch

### Pagination State (in RecipeSearch component)

| Field | Type | Description |
|---|---|---|
| `filter` | `Signal<RecipeFilter>` | Existing — drives API search |
| `currentPage` | `LinkedSignal<number>` | 0-indexed; auto-resets to 0 when `filter` changes |
| `allRecipes` | `ResourceRef<Recipe[]>` | Existing `rxResource` — holds the full unsliced result |
| `paginatedRecipes` | `Signal<Recipe[]>` | Computed — slice of `allRecipes.value()` for current page |
| `totalPages` | `Signal<number>` | Computed — `Math.ceil(allRecipes.value().length / PAGE_SIZE)` |

### Constant

```typescript
const PAGE_SIZE = 12; // module-level, recipe-search.ng.ts
```

### Computed derivations

```
paginatedRecipes = allRecipes.value()
                     .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

totalPages = Math.ceil(allRecipes.value().length / PAGE_SIZE)
             (returns 0 when allRecipes.value() is empty/undefined)
```

---

## State Transitions

| Event | State change |
|---|---|
| Filter input changes | `filter` signal updates → `allRecipes` refetches → `currentPage` resets to 0 |
| User clicks "Next" | `currentPage` increments by 1 (capped at `totalPages - 1`) |
| User clicks "Previous" | `currentPage` decrements by 1 (floored at 0) |
| User clicks "Retry" | `allRecipes.reload()` called; `currentPage` unchanged |
| API call in-flight | `allRecipes.isLoading() === true` |
| API call fails | `allRecipes.error()` is set; results cleared |
| API call succeeds | `allRecipes.value()` populated; `paginatedRecipes` and `totalPages` recomputed |

---

## Validation Rules

- `currentPage` is always in range `[0, totalPages - 1]`; component enforces this via disabled controls
- `PAGE_SIZE` is a fixed constant (12); not validated at runtime
- `totalPages` is 0 when the result set is empty; the `Paginator` component hides itself when `totalPages <= 1`
