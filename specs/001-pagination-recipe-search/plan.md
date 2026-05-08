# Implementation Plan: Paginated Recipe Search

**Branch**: `2026-pagination-recipe-search` | **Date**: 2026-05-08 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-pagination-recipe-search/spec.md`

## Summary

Add client-side pagination to the recipe search results. The API returns all matching recipes in one call, so results are sliced in the `RecipeSearch` component using Angular signals. A new `Paginator` component renders "Page X of Y" with Next/Previous controls. Filter changes automatically reset the page to 1. Loading and error states are surfaced via `rxResource` built-ins.

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21 (standalone)  
**Primary Dependencies**: Angular Signals (`signal`, `linkedSignal`, `computed`), `rxResource` (rxjs-interop), Angular Material (existing UI kit)  
**Storage**: N/A  
**Testing**: Vitest (browser mode) + Angular TestBed — test files named `*.browser.spec.ts`  
**Target Platform**: Web (browser)  
**Project Type**: Single-page web application (Nx monorepo)  
**Performance Goals**: Page navigation is instant (client-side slice, no network round-trip)  
**Constraints**: Page size fixed at 12; no server-side pagination changes needed  
**Scale/Scope**: Pagination applies to the full result set returned by the recipe API

## Constitution Check

The project constitution (`/.specify/memory/constitution.md`) is a blank template — no project-specific principles are defined. No gates to enforce.

*Re-check after Phase 1 design*: N/A — no violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/001-pagination-recipe-search/
├── plan.md              # This file
├── research.md          # Phase 0 — pagination strategy decisions
├── data-model.md        # Phase 1 — state model and transitions
├── quickstart.md        # Phase 1 — dev setup and test commands
├── contracts/
│   ├── paginator.component.md      # Paginator input/output contract
│   └── recipe-search.component.md # RecipeSearch internal changes
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (files to create or modify)

```text
src/app/
├── shared/
│   └── paginator.ng.ts            # NEW — Paginator UI component
├── recipe/
│   ├── recipe-search.ng.ts        # MODIFY — add pagination state + Paginator
│   └── recipe-search.browser.spec.ts  # MODIFY — add pagination test cases
└── shared/
    └── paginator.browser.spec.ts  # NEW — Paginator component tests
```

**Structure Decision**: Single Angular project (Option 1). No new libraries or modules — changes are confined to `src/app/shared/` and `src/app/recipe/`.

## Phase 0: Research (complete)

See [`research.md`](./research.md).

All unknowns resolved:

| Unknown | Resolution |
|---|---|
| Pagination mode | Client-side slice (API returns all results, no pagination params) |
| Page reset mechanism | `linkedSignal` resets `currentPage` to 0 on `filter` change |
| Paginator UI | New `Paginator` component — not `mat-paginator` |
| Loading/error states | `rxResource.isLoading()` / `.error()` / `.reload()` |
| Page size | `PAGE_SIZE = 12` constant |

## Phase 1: Design & Contracts (complete)

### Data Model

See [`data-model.md`](./data-model.md).

Key state in `RecipeSearch`:

```typescript
const PAGE_SIZE = 12;

filter      = signal<RecipeFilter>({});
currentPage = linkedSignal({ source: this.filter, computation: () => 0 });
allRecipes  = rxResource({ params: this.filter, stream: ({ params }) => repo.search(params) });

paginatedRecipes = computed(() => {
  const all = this.allRecipes.value() ?? [];
  const p   = this.currentPage();
  return all.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE);
});

totalPages = computed(() =>
  Math.ceil((this.allRecipes.value()?.length ?? 0) / PAGE_SIZE)
);
```

### Interface Contracts

See [`contracts/`](./contracts/).

- **`Paginator` component** — inputs: `currentPage`, `totalPages`, `isLoading`; outputs: `next`, `previous`
- **`RecipeSearch` component** — external API unchanged; internal signals extended

### Implementation Notes

1. **`Paginator` component** (`src/app/shared/paginator.ng.ts`):
   - Pure presentational component, no injected services
   - Hides itself via `@if (totalPages() > 1)` 
   - Uses `input()` / `output()` signal-based API (Angular 17+ style)
   - "Previous" and "Next" are standard `<button>` elements (not `mat-button` required, but can use for style consistency)

2. **`RecipeSearch` modifications** (`src/app/recipe/recipe-search.ng.ts`):
   - Rename `recipes` → `allRecipes` (internal only)
   - Add `currentPage`, `paginatedRecipes`, `totalPages`
   - Template: `@for` loops over `paginatedRecipes()`
   - Template: add `@if (allRecipes.isLoading())` loading block
   - Template: add `@if (allRecipes.error())` error block with Retry button calling `allRecipes.reload()`
   - Template: add `<wm-paginator>` wired to signals

3. **Testing pattern** (follow existing `recipe-search.browser.spec.ts`):
   - Use `RecipeRepositoryFake.setRecipes([...])` to seed > 12 recipes for pagination tests
   - Use `RecipeRepositoryFake.pause()` to test loading state
   - Query paginator controls via `page.getByRole('button', { name: 'Next' })` etc.
   - Separate `paginator.browser.spec.ts` tests the component in isolation

## Complexity Tracking

No constitution violations. No complexity justification required.
