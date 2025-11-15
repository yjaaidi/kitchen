# Tasks: Recipe Search Pagination

**Input**: Design documents from `/specs/recipe-search-pagination/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, contracts/, quickstart.md

**Tests**: Test tasks are included to maintain the project's testing standards (fakes, setup functions, ng-test-utils).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Angular SPA**: `src/app/` for components, services, models
- All paths relative to repository root: `/Users/y/dev/yjaaidi/kitchen/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and install dependencies

- [x] T001 Verify Angular Material is installed and configured for pagination
- [x] T002 Review existing recipe search structure in src/app/recipe/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Extend RecipeFilter interface with page property in src/app/recipe/recipe-filter.ts
- [x] T004 [P] Create pagination state types and utility functions in src/app/recipe/pagination-state.ts
- [x] T005 Update createRecipeFilter() factory to handle page parameter in src/app/recipe/recipe-filter.ts
- [x] T006 [P] Update RecipeRepositoryFake to support pagination filter in src/app/recipe/recipe-repository.fake.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Page Navigation (Priority: P1) 🎯 MVP

**Goal**: Users can browse recipe results in pages of 12, navigate forward/backward with prev/next buttons, see current page indicator

**Independent Test**: Perform a recipe search returning >12 results, verify only 12 recipes display, click "Next Page" to see next 12 recipes, verify page indicator updates, verify prev/next buttons enable/disable correctly

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Write unit tests for computePaginationState() function in src/app/recipe/pagination-state.spec.ts
- [x] T008 [P] [US1] Write unit tests for getPageItems() function in src/app/recipe/pagination-state.spec.ts
- [x] T009 [P] [US1] Write unit tests for shouldShowPagination() function in src/app/recipe/pagination-state.spec.ts

### Implementation for User Story 1

- [x] T010 [US1] Create PaginationControls component with Material paginator in src/app/recipe/pagination-controls.ng.ts
- [x] T011 [US1] Add pagination state signals to RecipeSearch component in src/app/recipe/recipe-search.ng.ts
- [x] T012 [US1] Implement client-side slicing logic in RecipeSearch component in src/app/recipe/recipe-search.ng.ts
- [x] T013 [US1] Add pagination controls to RecipeSearch template in src/app/recipe/recipe-search.ng.ts
- [x] T014 [US1] Implement page change handler in RecipeSearch component in src/app/recipe/recipe-search.ng.ts
- [x] T015 [US1] Update filter change handler to reset to page 1 in src/app/recipe/recipe-search.ng.ts
- [x] T016 [US1] Add conditional rendering to hide pagination when <= 12 results in src/app/recipe/recipe-search.ng.ts
- [x] T017 [P] [US1] Write component tests for pagination visibility in src/app/recipe/recipe-search.spec.ts
- [x] T018 [P] [US1] Write component tests for page navigation in src/app/recipe/recipe-search.spec.ts
- [x] T019 [P] [US1] Write component tests for filter changes resetting pagination in src/app/recipe/recipe-search.spec.ts
- [x] T020 [P] [US1] Write component tests for PaginationControls events in src/app/recipe/pagination-controls.spec.ts

**Checkpoint**: At this point, User Story 1 should be fully functional - users can paginate through search results with prev/next buttons

---

## Phase 4: User Story 2 - Efficient Multi-Page Navigation (Priority: P2)

**Goal**: Users can jump directly to specific pages, use first/last page buttons, see page number range with ellipsis

**Independent Test**: Create search with 8+ pages, click directly on page number "5" and verify it loads, click "First Page" and "Last Page" buttons and verify navigation, verify page numbers display with ellipsis (1, 2, 3, "...", 7, 8)

### Tests for User Story 2

- [ ] T021 [P] [US2] Write unit tests for getVisiblePageNumbers() function in src/app/recipe/pagination-state.spec.ts
- [ ] T022 [P] [US2] Write component tests for direct page number selection in src/app/recipe/pagination-controls.spec.ts
- [ ] T023 [P] [US2] Write component tests for first/last page buttons in src/app/recipe/pagination-controls.spec.ts

### Implementation for User Story 2

- [ ] T024 [US2] Implement getVisiblePageNumbers() utility function in src/app/recipe/pagination-state.ts
- [ ] T025 [US2] Enable MatPaginator showFirstLastButtons option in src/app/recipe/pagination-controls.ng.ts
- [ ] T026 [US2] Configure MatPaginator to show clickable page numbers in src/app/recipe/pagination-controls.ng.ts
- [ ] T027 [US2] Add page number range display with ellipsis support in src/app/recipe/pagination-controls.ng.ts
- [ ] T028 [US2] Write integration tests for multi-page navigation scenarios in src/app/recipe/recipe-search.spec.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users have full pagination control including direct page jumps

---

## Phase 5: User Story 3 - Shareable Page States (Priority: P3)

**Goal**: Page number and filters persist in URL for sharing and bookmarking, browser back/forward buttons work correctly

**Independent Test**: Navigate to page 3 of search results, copy URL, open in new tab and verify same page loads, use browser back button and verify previous page displays, bookmark a page and verify it loads correctly later

### Tests for User Story 3

- [ ] T029 [P] [US3] Write tests for URL query param synchronization in src/app/recipe/recipe-search.spec.ts
- [ ] T030 [P] [US3] Write tests for URL updates on page changes in src/app/recipe/recipe-search.spec.ts
- [ ] T031 [P] [US3] Write tests for URL updates on filter changes in src/app/recipe/recipe-search.spec.ts
- [ ] T032 [P] [US3] Write tests for browser back/forward navigation in src/app/recipe/recipe-search.spec.ts

### Implementation for User Story 3

- [ ] T033 [US3] Inject Router and ActivatedRoute services in src/app/recipe/recipe-search.ng.ts
- [ ] T034 [US3] Add toSignal() to read query params as signal in src/app/recipe/recipe-search.ng.ts
- [ ] T035 [US3] Update filter signal to derive from query params in src/app/recipe/recipe-search.ng.ts
- [ ] T036 [US3] Update onPageChange() to navigate with query params in src/app/recipe/recipe-search.ng.ts
- [ ] T037 [US3] Update onFilterChange() to navigate with query params in src/app/recipe/recipe-search.ng.ts
- [ ] T038 [US3] Add normalizePageNumber() function for invalid page handling in src/app/recipe/pagination-state.ts
- [ ] T039 [US3] Handle invalid page numbers in URL (redirect to page 1) in src/app/recipe/recipe-search.ng.ts
- [ ] T040 [US3] Test URL sharing with different page numbers and filters in src/app/recipe/recipe-search.spec.ts

**Checkpoint**: All user stories should now be independently functional - complete pagination with URL persistence

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, error handling, and refinements affecting multiple user stories

- [ ] T041 [P] Add test for empty results (no pagination shown) in src/app/recipe/recipe-search.spec.ts
- [ ] T042 [P] Add test for single page results (no pagination shown) in src/app/recipe/recipe-search.spec.ts
- [ ] T043 [P] Add test for rapid page navigation (request cancellation) in src/app/recipe/recipe-search.spec.ts
- [ ] T044 [P] Add test for no duplicate recipes across pages in src/app/recipe/recipe-search.spec.ts
- [ ] T045 [P] Add test for no missing recipes between pages in src/app/recipe/recipe-search.spec.ts
- [ ] T046 Verify OnPush change detection is used in all components
- [ ] T047 Verify no effect() function usage (signals and computed only)
- [ ] T048 Run linter and fix any errors
- [ ] T049 Verify all tests pass with npm test
- [ ] T050 Manual testing: Test with 0, 1, 12, 13, 50, 100+ recipe results
- [ ] T051 Manual testing: Keyboard navigation and accessibility audit
- [ ] T052 [P] Update recipe.mother.ts with paginated result builders if needed in src/app/testing/recipe.mother.ts
- [ ] T053 Performance check: Verify page navigation completes under 1 second
- [ ] T054 Constitution compliance review against .specify/memory/constitution.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but is independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Adds URL layer to US1/US2 but is independently testable

### Within Each User Story

1. Tests MUST be written and FAIL before implementation
2. Utility functions before components
3. Components before integration tests
4. Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: Both tasks can run in parallel
- **Phase 2**: All 4 tasks marked [P] can run in parallel
- **User Story 1**: Tests T007-T009 can run in parallel, tests T017-T020 can run in parallel
- **User Story 2**: Tests T021-T023 can run in parallel
- **User Story 3**: Tests T029-T032 can run in parallel
- **Polish Phase**: Most tasks marked [P] can run in parallel
- **Across Stories**: Once Phase 2 completes, all user stories can be developed in parallel by different developers

---

## Parallel Example: User Story 1

```bash
# Launch all unit tests for pagination-state together:
Task T007: "Write unit tests for computePaginationState()"
Task T008: "Write unit tests for getPageItems()"
Task T009: "Write unit tests for shouldShowPagination()"

# Later, launch all component tests together:
Task T017: "Write tests for pagination visibility"
Task T018: "Write tests for page navigation"
Task T019: "Write tests for filter changes resetting"
Task T020: "Write tests for PaginationControls events"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify dependencies)
2. Complete Phase 2: Foundational (types and utilities - CRITICAL)
3. Complete Phase 3: User Story 1 (basic pagination)
4. **STOP and VALIDATE**: Test with various result counts (0, 12, 50+ recipes)
5. Demo/review before proceeding

**MVP Delivers**: Users can paginate through recipe search results (12 per page) with prev/next buttons

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (T001-T006)
2. Add User Story 1 → Test independently → Demo (MVP! - T007-T020)
3. Add User Story 2 → Test independently → Demo (Enhanced navigation - T021-T028)
4. Add User Story 3 → Test independently → Demo (URL sharing - T029-T040)
5. Polish → Final testing and refinement (T041-T054)

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T006)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (T007-T020)
   - **Developer B**: User Story 2 (T021-T028)
   - **Developer C**: User Story 3 (T029-T040)
3. Stories complete and integrate independently
4. Team reconvenes for Polish phase (T041-T054)

---

## Task Summary

**Total Tasks**: 54

### Tasks by Phase

- **Phase 1 (Setup)**: 2 tasks
- **Phase 2 (Foundational)**: 4 tasks (BLOCKS all user stories)
- **Phase 3 (User Story 1 - P1 MVP)**: 14 tasks
- **Phase 4 (User Story 2 - P2)**: 8 tasks
- **Phase 5 (User Story 3 - P3)**: 12 tasks
- **Phase 6 (Polish)**: 14 tasks

### Parallel Opportunities

- **4 tasks** in Foundational phase can run in parallel
- **3 tests** in US1 can run in parallel (T007-T009)
- **4 tests** in US1 can run in parallel (T017-T020)
- **3 tests** in US2 can run in parallel (T021-T023)
- **4 tests** in US3 can run in parallel (T029-T032)
- **10 tasks** in Polish phase can run in parallel
- **All 3 user stories** can be developed in parallel after Foundational completes

### Independent Test Criteria

- **User Story 1**: Search with 50 recipes → verify 12 per page, next/prev work, page indicator correct
- **User Story 2**: Search with 100 recipes → click page "5" directly, use first/last buttons, verify ellipsis display
- **User Story 3**: Navigate to page 3 → copy URL → open in new tab → verify same page loads

### Suggested MVP Scope

**Minimum**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only)

**Delivers**: Functional pagination for recipe search with prev/next navigation

**Tasks**: T001-T020 (20 tasks total for MVP)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [US1/US2/US3] labels map tasks to user stories for traceability
- Each user story is independently completable and testable
- Verify tests fail (red) before implementing (green)
- Constitution requires: OnPush, signals, standalone, .ng.ts extension, no effect()
- Client-side pagination approach: fetch all results, slice locally
- Page size fixed at 12 recipes per page
- Page numbering is 1-based (not 0-based)
- URL format: `?keywords=pasta&maxIngredientCount=5&page=3`
- Request cancellation handled automatically by rxResource
