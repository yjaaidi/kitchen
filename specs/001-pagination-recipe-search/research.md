# Research: Pagination for Recipe Search

## Decision 1: Client-side vs. Server-side Pagination

**Decision**: Client-side pagination (slice the full result set in the component).

**Rationale**: The recipe API (`https://recipe-api.marmicode.io/recipes`) returns all matching results in a single `RecipeListResponseDto` with an `items[]` array. It accepts no pagination parameters (`limit`, `offset`, `page`, etc.). Additionally, `maxIngredientCount` filtering is already applied client-side after the API response. Introducing server-side pagination would require API changes out of scope for v1.

**Alternatives considered**:
- Server-side pagination — requires API support not currently available.
- Infinite scroll — out of scope; spec calls for explicit page navigation.

---

## Decision 2: Page State Management

**Decision**: Separate `currentPage` signal managed via Angular `linkedSignal`, reset automatically when `filter` changes.

**Rationale**: `linkedSignal({ source: filter, computation: () => 0 })` provides automatic reset of `currentPage` to 0 whenever the `filter` signal changes, cleanly satisfying FR-006 without requiring an `effect()` or manual wiring.

**Pattern**:
```typescript
filter = signal<RecipeFilter>({});
currentPage = linkedSignal({ source: this.filter, computation: () => 0 });
```

**Alternatives considered**:
- Using `effect()` to watch `filter` and call `currentPage.set(0)` — works but more verbose.
- Including `page` inside `RecipeFilter` — conflates search params with pagination state, complicates resets.

---

## Decision 3: Paginator UI Component

**Decision**: Create a new standalone `Paginator` component (`src/app/shared/paginator.ng.ts`).

**Rationale**: Angular Material's `mat-paginator` renders a page-size selector and numbered page buttons, which diverges from the spec's "Page X of Y" + Next/Previous pattern. A thin custom component takes ~30 lines and exactly matches requirements.

**Component API**:
- Inputs: `currentPage` (0-indexed number), `totalPages` (number), `isLoading` (boolean)
- Outputs: `next`, `previous` (EventEmitter<void>)
- Renders: "Previous" button, "Page {currentPage+1} of {totalPages}" label, "Next" button
- Hides entirely when `totalPages <= 1`
- Disables "Previous" when `currentPage === 0`, "Next" when `currentPage === totalPages - 1`

**Alternatives considered**:
- `mat-paginator` — feature-rich but UI doesn't match spec.
- Inline template in `RecipeSearch` — harder to test and reuse.

---

## Decision 4: Loading and Error State

**Decision**: Use `rxResource`'s built-in `isLoading()` and `error()` signals; use `reload()` for retry.

**Rationale**: `rxResource` already tracks request lifecycle. `isLoading()` becomes `true` during any fetch (initial load, filter change, reload). `error()` holds the thrown error if the stream errors. `reload()` re-triggers the last request — natural retry mechanism.

**Loading indicator**: Pass `allRecipes.isLoading()` to `Paginator`; when `true`, disable both navigation buttons and show a spinner or dimmed state.

**Error message**: When `allRecipes.error()` is set, render an error message and a "Retry" button in `RecipeSearch` that calls `allRecipes.reload()`.

**Alternatives considered**:
- Global error handling service — overkill for a single component's error state.
- Manual `catchError` + local signal — duplicates what `rxResource` already provides.

---

## Decision 5: Page Size Constant

**Decision**: Define `PAGE_SIZE = 12` as a module-level constant in `recipe-search.ng.ts`.

**Rationale**: Spec (FR-001, clarified) fixes page size at 12, non-user-adjustable. A named constant (not magic number) makes it easy to locate if the value ever changes via spec amendment.

---

## Summary Table

| Topic | Decision |
|---|---|
| Pagination mode | Client-side slice of full API result |
| Page reset on filter change | `linkedSignal` auto-reset |
| Paginator UI | New `Paginator` component |
| Loading/error | `rxResource.isLoading()` / `.error()` / `.reload()` |
| Page size | `PAGE_SIZE = 12` constant |
