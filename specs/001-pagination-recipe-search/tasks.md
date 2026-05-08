# Tasks: Paginated Recipe Search

**Input**: Design documents from `/specs/001-pagination-recipe-search/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths are relative to the repository root. Source files live under `src/app/`.

---

## Phase 1: Setup

This feature modifies an existing Angular 21 project. Angular Signals, `rxResource`, Vitest browser mode, and Angular Material are already available — no new dependencies or configuration required.

*(No setup tasks — proceed directly to Phase 2)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `Paginator` standalone component. It is a required dependency for all three user stories via `RecipeSearch` and has no dependency on any story implementation.

**⚠️ CRITICAL**: `RecipeSearch` integration cannot begin until this phase is complete.

- [ ] T001 Write `Paginator` component tests covering all contract behaviours (hidden when `totalPages <= 1`, disabled states, label format, next/previous events) in `src/app/shared/paginator.browser.spec.ts`
- [ ] T002 Create `Paginator` standalone component with `input()`/`output()` signal API per contract in `src/app/shared/paginator.ng.ts`

**Checkpoint**: `Paginator` component is independently functional — all tests in `paginator.browser.spec.ts` pass.

---

## Phase 3: User Story 1 — Browse First Page of Results (Priority: P1) 🎯 MVP

**Goal**: When search returns more than 12 results, only the first 12 are shown with the page label and navigation controls visible. When results fit on a single page, no pagination controls are shown.

**Independent Test**: Seed 25 recipes via `RecipeRepositoryFake.setRecipes([...])`, mount `RecipeSearch`, verify exactly 12 recipe cards render and "Page 1 of 3" is visible. Then seed 5 recipes, verify all 5 cards render and no pagination controls appear.

### Tests for User Story 1

> **Write tests FIRST — confirm they FAIL before proceeding to implementation**

- [ ] T003 [US1] Add test: 25-recipe result shows exactly 12 cards on page 1 with "Page 1 of 3" label visible in `src/app/recipe/recipe-search.browser.spec.ts`
- [ ] T004 [US1] Add test: result set of fewer than 13 recipes shows all cards with no pagination controls rendered in `src/app/recipe/recipe-search.browser.spec.ts`

### Implementation for User Story 1

- [ ] T005 [US1] Add `PAGE_SIZE = 12` module-level constant and rename existing `recipes` rxResource to `allRecipes` in `src/app/recipe/recipe-search.ng.ts`
- [ ] T006 [US1] Add `currentPage = signal(0)`, `paginatedRecipes` computed (slice of `allRecipes.value()`), and `totalPages` computed (`Math.ceil(length / PAGE_SIZE)`) in `src/app/recipe/recipe-search.ng.ts`
- [ ] T007 [US1] Update `@for` loop to iterate `paginatedRecipes()` and add `<wm-paginator [currentPage]="currentPage()" [totalPages]="totalPages()">` below the recipe list in `src/app/recipe/recipe-search.ng.ts`

**Checkpoint**: User Story 1 is independently functional — 25-recipe search shows 12 on page 1 with label; 5-recipe search shows all cards with no controls.

---

## Phase 4: User Story 2 — Navigate Between Pages (Priority: P2)

**Goal**: Clicking "Next" advances to the next page; clicking "Previous" goes back. Buttons are disabled on the first/last page and while loading. An error state shows a retry option that keeps the user on the current page.

**Independent Test**: Seed 25 recipes, click "Next", verify page 2 results appear and label reads "Page 2 of 3". Click "Previous", verify page 1 results and "Page 1 of 3" return.

### Tests for User Story 2

> **Write tests FIRST — confirm they FAIL before proceeding to implementation**

- [ ] T008 [US2] Add test: clicking "Next" shows page 2 results and updates label to "Page 2 of N" in `src/app/recipe/recipe-search.browser.spec.ts`
- [ ] T009 [US2] Add test: clicking "Previous" from page 2 returns page 1 results and label to "Page 1 of N" in `src/app/recipe/recipe-search.browser.spec.ts`
- [ ] T010 [US2] Add test: "Next" button is disabled when on the last page in `src/app/recipe/recipe-search.browser.spec.ts`
- [ ] T011 [US2] Add test: "Previous" button is disabled when on page 1 in `src/app/recipe/recipe-search.browser.spec.ts`
- [ ] T012 [US2] Add test: loading indicator is visible while API response is paused via `RecipeRepositoryFake.pause()` in `src/app/recipe/recipe-search.browser.spec.ts`

### Implementation for User Story 2

- [ ] T013 [US2] Wire `(next)` output to `currentPage.update(p => p + 1)` and `(previous)` to `currentPage.update(p => p - 1)` in the `<wm-paginator>` element in `src/app/recipe/recipe-search.ng.ts`
- [ ] T014 [US2] Add `[isLoading]="allRecipes.isLoading()"` to `<wm-paginator>` and add `@if (allRecipes.isLoading())` loading indicator block above the recipe list in `src/app/recipe/recipe-search.ng.ts`
- [ ] T015 [US2] Add `@if (allRecipes.error())` error block with error message and Retry button calling `allRecipes.reload()` in `src/app/recipe/recipe-search.ng.ts`

**Checkpoint**: Navigation works end-to-end — page label updates on Next/Previous, disabled states are correct on first/last page, loading indicator appears during fetch, Retry button is visible on error.

---

## Phase 5: User Story 3 — Filter Changes Reset Pagination (Priority: P3)

**Goal**: When the user changes any search filter while on a page beyond page 1, the display automatically resets to page 1.

**Independent Test**: Seed 25 recipes, navigate to page 2, change the keywords filter, verify the display returns to "Page 1 of N" showing page 1 results.

### Tests for User Story 3

> **Write tests FIRST — confirm they FAIL before proceeding to implementation**

- [ ] T016 [US3] Add test: changing the `filter` signal while on page 2 resets the visible page to 1 with "Page 1 of N" label in `src/app/recipe/recipe-search.browser.spec.ts`

### Implementation for User Story 3

- [ ] T017 [US3] Replace `currentPage = signal(0)` with `currentPage = linkedSignal({ source: this.filter, computation: () => 0 })` in `src/app/recipe/recipe-search.ng.ts`

**Checkpoint**: Changing keywords, `maxIngredientCount`, or `maxStepCount` while on any page beyond 1 instantly resets the view to page 1.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Full validation across all stories and manual verification on live data.

- [ ] T018 Run full test suite and confirm all tests pass: `npx nx test kitchen`
- [ ] T019 [P] Start dev server and manually verify pagination on live recipe data: `npx nx serve kitchen`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No tasks — project already configured
- **Phase 2 (Foundational)**: No phase dependencies — start immediately
- **Phase 3 (US1)**: Depends on Phase 2 — `Paginator` component must exist before `RecipeSearch` integration
- **Phase 4 (US2)**: Depends on Phase 3 — `currentPage` signal, `paginatedRecipes`, and `<wm-paginator>` template wiring must exist
- **Phase 5 (US3)**: Depends on Phase 4 — navigation wiring must be in place before converting `currentPage` to `linkedSignal`
- **Phase 6 (Polish)**: Depends on all user story phases

### User Story Dependencies

- **US1 (P1)**: Can start immediately after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Depends on US1 — `currentPage` signal and `<wm-paginator>` element must exist to wire outputs
- **US3 (P3)**: Depends on US2 — `(next)`/`(previous)` must be wired before swapping `signal` for `linkedSignal`

### Within Each Phase

- Tests are written first and must fail before implementation begins
- Implementation tasks within a phase are sequential (multiple edits target the same `.ng.ts` file)
- Phase 2 is strictly T001 → T002 (TDD: write failing tests, then make them pass)

### Parallel Opportunities

- T001 (Paginator tests) and T002 (Paginator component) are in different files — a second developer can start T002 once the contract is clear, while T001 is still being written
- Within Phase 3: T003/T004 (spec file) can be written while T005 (ng.ts constant + rename) is drafted in parallel — different files
- T018 (test runner) and T019 (dev server) in Phase 6 are fully independent and can run simultaneously

---

## Parallel Example: Phase 2 — Paginator Component

```
# Developer A (tests-first)
Task T001: Write Paginator tests in src/app/shared/paginator.browser.spec.ts

# Developer B (can start from contract)
Task T002: Create Paginator component in src/app/shared/paginator.ng.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2 — create `Paginator` component (T001 → T002)
2. Complete Phase 3 — first-page display (T003 → T004 → T005 → T006 → T007)
3. **STOP and VALIDATE**: `npx nx test kitchen -- recipe-search` + manual check at `http://localhost:4200`
4. Demo or deploy if first-page display is sufficient value

### Incremental Delivery

1. Phase 2 complete → `Paginator` component ready
2. US1 complete → first page display → validate → demo (**MVP**)
3. US2 complete → navigation + loading/error states → validate → demo
4. US3 complete → filter reset → validate → demo
5. Phase 6 → full suite + manual sign-off

---

## Notes

- `[P]` tasks use different files with no sequential dependency
- `[Story]` label maps each task to a specific user story for traceability
- Verify tests fail before implementing: `npx nx test kitchen -- recipe-search`
- Seed test data via `RecipeRepositoryFake.setRecipes([...])` (see `quickstart.md`)
- Simulate loading via `RecipeRepositoryFake.pause()` (see `quickstart.md`)
- `PAGE_SIZE = 12` is a module-level constant in `recipe-search.ng.ts` (not exported)
- `linkedSignal` replaces plain `signal(0)` only in US3 (T017); US1/US2 use `signal(0)` intentionally
- `allRecipes.reload()` retries without resetting `currentPage` — user stays on their current page
