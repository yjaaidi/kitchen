# Implementation Plan: Recipe Search Pagination

**Branch**: `sk` | **Date**: November 15, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/recipe-search-pagination/spec.md`

## Summary

Add pagination controls to the recipe search feature to display results in manageable pages (12 recipes per page). Users can navigate between pages using previous/next buttons, direct page number selection, and first/last page controls. Page state persists in the URL for sharing and bookmarking. The implementation extends the existing filter system to include pagination parameters and ensures filter changes reset to page 1.

## Technical Context

**Language/Version**: TypeScript (Angular 17+)
**Primary Dependencies**: Angular 17+, RxJS, Angular Material, HttpClient
**Storage**: Remote API (`https://recipe-api.marmicode.io/recipes`)
**Testing**: Vitest with @testing-library/angular, custom ng-test-utils
**Target Platform**: Web browser (SPA)
**Project Type**: Single-page web application
**Performance Goals**: Page navigation under 1 second, filter changes reset within 100ms
**Constraints**: OnPush change detection, signal-based state, no effect() function usage
**Scale/Scope**: ~10-20 components in feature, API returns variable recipe counts

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Constitution Alignment

✅ **I. Standalone Components**: All components will be standalone (no modules)

✅ **II. Modern Angular Patterns**:

- Signals for pagination state management
- `input()` and `output()` functions for component communication
- Control flow syntax (`@if`, `@for`) in templates
- `rxResource` for API data fetching
- `inject()` for dependency injection
- No `effect()` usage

✅ **III. Component File Naming**: Will use `.ng.ts` extension for new pagination components

✅ **IV. Inline Templates & Styles**: Components will use inline templates; styles only if needed

✅ **V. Testing Discipline**:

- Use fakes for RecipeRepository in tests
- Setup functions instead of beforeEach/afterEach
- Use `ng-test-utils` (t.configure, t.mount, t.inject)
- Test files named `{component}.spec.ts`

✅ **VI. OnPush Change Detection**: All components use `ChangeDetectionStrategy.OnPush`

✅ **VII. Simplicity & Convention**:

- Use `wm-` prefix for component selectors
- Focused, single-purpose components
- Composition over inheritance

### Gate Status: **PASS** ✅

No constitution violations. All principles will be followed.

## Project Structure

### Documentation (this feature)

```text
specs/recipe-search-pagination/
├── plan.md              # This file
├── research.md          # Phase 0 output - API pagination research
├── data-model.md        # Phase 1 output - Pagination state model
├── quickstart.md        # Phase 1 output - Development guide
├── contracts/           # Phase 1 output - API contracts
│   └── pagination-api.md
├── checklists/
│   └── requirements.md  # Already created
└── spec.md              # Already created
```

### Source Code (repository root)

```text
src/app/
├── recipe/
│   ├── recipe-search.ng.ts           # MODIFY: Add pagination state & controls
│   ├── recipe-search.spec.ts         # MODIFY: Add pagination tests
│   ├── recipe-filter.ts              # MODIFY: Add page number to filter type
│   ├── recipe-filter-form.ng.ts      # No changes needed
│   ├── recipe-repository.ts          # MODIFY: Add pagination params to API calls
│   ├── recipe-repository.fake.ts     # MODIFY: Support pagination in fake
│   ├── recipe-preview.ng.ts          # No changes needed
│   ├── recipe.ts                     # No changes needed
│   ├── pagination-controls.ng.ts    # NEW: Pagination UI component
│   ├── pagination-controls.spec.ts  # NEW: Tests for pagination
│   └── pagination-state.ts          # NEW: Pagination state logic & types
├── shared/
│   ├── catalog.ng.ts                # No changes needed
│   └── ...
└── testing/
    ├── ng-test-utils.ts             # No changes needed
    └── recipe.mother.ts             # Possible extension for paginated results
```

**Structure Decision**: Single-page web application structure. All pagination code lives in the `recipe/` feature directory alongside existing recipe search components. New components follow the `.ng.ts` convention, and pagination state logic is separated into its own module file.

## Complexity Tracking

No constitution violations to justify.
