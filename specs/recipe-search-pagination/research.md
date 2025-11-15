# Research: Recipe Search Pagination

**Date**: November 15, 2025
**Purpose**: Research technical decisions for implementing pagination in recipe search

## Research Tasks

### 1. Recipe API Pagination Support

**Question**: Does the recipe API (`https://recipe-api.marmicode.io/recipes`) support server-side pagination parameters?

**Decision**: Investigate API capabilities and implement appropriate pagination strategy

**Research Findings**:

- Current API usage: `GET https://recipe-api.marmicode.io/recipes?embed=ingredients&q={keywords}`
- Need to determine if API supports pagination query parameters (common patterns: `page`, `limit`, `offset`, `per_page`)
- Common REST pagination patterns:
  - **Offset-based**: `?offset=0&limit=12` or `?page=1&per_page=12`
  - **Cursor-based**: `?cursor=abc123&limit=12` (better for large datasets)
  - **Page-based**: `?page=1&page_size=12` (most user-friendly)

**Investigation Approach**:

1. Test API with pagination parameters to see what's supported
2. Check API response headers for pagination metadata (`X-Total-Count`, `Link` headers)
3. Examine response structure for pagination envelope (e.g., `{ items: [], total: 100, page: 1 }`)

**Rationale for Decision**:

- **If API supports server-side pagination**: Use it for optimal performance and accurate total counts
- **If API doesn't support pagination**: Implement client-side pagination by fetching all results and slicing locally
  - Trade-off: Initial load fetches all data, but subsequent page changes are instant
  - Acceptable for recipe searches that typically return <200 results

**Alternatives Considered**:

- **Virtual scrolling**: Rejected because spec explicitly requires page-based navigation
- **Infinite scroll**: Rejected because spec requires traditional pagination with page numbers
- **Hybrid approach**: Could cache full result set locally and paginate in-memory

**Chosen Strategy**:
Start with client-side pagination implementation (slice already-fetched results). This approach:

- Works immediately regardless of API capabilities
- Maintains all existing filter functionality
- Can be upgraded to server-side pagination later if API adds support
- Aligns with current implementation where `maxIngredientCount` is filtered client-side

---

### 2. URL State Management

**Question**: How to persist pagination state (page number, filters) in URL using Angular Router?

**Decision**: Use Angular Router query parameters with signal-based synchronization

**Research Findings**:

- Angular Router provides `ActivatedRoute` with `queryParams` observable
- Can convert query params to signals using `toSignal()` or `rxResource`
- Router navigation updates URL without full page reload

**Implementation Pattern**:

```typescript
// Read query params as signal
queryParams = toSignal(this._route.queryParams, { initialValue: {} });

// Derive filter from query params
filter = computed(() => ({
  keywords: this.queryParams().keywords ?? '',
  maxIngredientCount: Number(this.queryParams().maxIngredientCount) || null,
  page: Number(this.queryParams().page) || 1
}));

// Update URL when filters change
updateUrl(newFilter: RecipeFilter) {
  this._router.navigate([], {
    queryParams: newFilter,
    queryParamsHandling: 'merge', // Preserve other params
    replaceUrl: false // Add to history
  });
}
```

**Rationale**:

- Query parameters are the standard web pattern for shareable filter state
- `queryParamsHandling: 'merge'` prevents overwriting other query params
- `replaceUrl: false` enables browser back/forward navigation
- Signals provide reactive updates without manual subscriptions

**Alternatives Considered**:

- **Route path parameters** (`/recipes/page/3`): Rejected - not semantic for filters
- **Fragment identifiers** (`#page=3`): Rejected - not standard for application state
- **Local storage**: Rejected - not shareable, doesn't support back/forward buttons
- **State management library** (NgRx, Akita): Rejected - overkill for this feature

---

### 3. Pagination UI Component

**Question**: What UI pattern and component library to use for pagination controls?

**Decision**: Use Angular Material's `MatPaginator` component as foundation

**Research Findings**:

- Angular Material is already a project dependency (used in `recipe-filter-form.ng.ts`)
- `MatPaginator` provides:
  - Page size selection
  - First/previous/next/last buttons
  - Page number display
  - Total count display
  - Accessibility (ARIA labels, keyboard navigation)
- Material Design patterns are familiar to users

**Implementation Approach**:

```typescript
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'wm-pagination-controls',
  imports: [MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="totalItems()"
      [pageSize]="pageSize()"
      [pageIndex]="currentPage() - 1"
      [pageSizeOptions]="[12]"
      (page)="pageChange.emit($event.pageIndex + 1)"
      aria-label="Select page of recipes">
    </mat-paginator>
  `
})
```

**Customization Needed**:

- MatPaginator uses 0-based page index; we use 1-based (convert in bindings)
- Hide page size selector since spec requires fixed 12 items per page
- Style to match application design

**Rationale**:

- Reuses existing dependency (no new packages)
- Provides complete pagination UX out of the box
- Accessible by default
- Can be wrapped/customized while maintaining consistency

**Alternatives Considered**:

- **Custom pagination component**: More control but requires building all UX/accessibility features
- **Third-party pagination library**: Adds dependency for minimal benefit
- **Native HTML controls**: Lacks cohesive UX and accessibility

---

### 4. RxJS Request Cancellation

**Question**: How to cancel in-flight API requests when pagination changes rapidly?

**Decision**: Use `switchMap` operator in RxJS pipeline

**Research Findings**:

- `rxResource` already handles request cancellation automatically via `switchMap` behavior
- When a new request is triggered, previous observable is unsubscribed
- HttpClient observables cancel underlying HTTP request on unsubscribe

**Current Implementation**:

```typescript
// In recipe-search.ng.ts
recipes = rxResource({
  params: this.filter,
  stream: ({ params }) => this._recipeRepository.search(params),
});
```

**How it works**:

1. When `filter` signal changes, `rxResource` triggers new request
2. Previous request observable is automatically unsubscribed
3. Angular's HttpClient cancels the HTTP request via AbortController
4. Only the latest request result is processed

**No Changes Required**: Current `rxResource` pattern already provides request cancellation. Filter changes (including page number) automatically cancel pending requests.

**Rationale**:

- `rxResource` is designed for this exact use case
- Automatic cancellation prevents race conditions
- No manual subscription management needed
- Works with Angular's signal-based architecture

**Alternatives Considered**:

- **Manual switchMap**: More boilerplate, same result
- **debounceTime**: Could delay requests, but spec requires immediate navigation
- **Request queue**: Unnecessary complexity for pagination

---

## Technology Stack Summary

| Component               | Technology                    | Rationale                                    |
| ----------------------- | ----------------------------- | -------------------------------------------- |
| **Pagination Strategy** | Client-side slicing           | Works with current API, instant page changes |
| **State Management**    | Angular Signals               | Modern Angular pattern, reactive updates     |
| **URL Persistence**     | Router query params           | Standard web pattern, shareable              |
| **UI Component**        | Angular Material MatPaginator | Already dependency, accessible, complete UX  |
| **Request Management**  | rxResource with switchMap     | Built-in cancellation, signal integration    |
| **Page Numbering**      | 1-based indexing              | User-friendly (page 1, 2, 3 vs 0, 1, 2)      |

---

## Implementation Risks & Mitigations

### Risk 1: API returns too many results for client-side pagination

**Likelihood**: Medium | **Impact**: High (poor initial load performance)

**Mitigation**:

- Monitor API response sizes during development
- If typical searches return >500 recipes, reconsider server-side pagination
- Add loading indicator during initial fetch
- Future enhancement: Implement server-side pagination if API adds support

### Risk 2: Filter changes during slow API request

**Likelihood**: High | **Impact**: Low (already mitigated)

**Mitigation**:

- `rxResource` automatically cancels previous requests
- UI shows loading state during transitions
- Latest filter always wins

### Risk 3: URL becomes cluttered with many filter parameters

**Likelihood**: Low | **Impact**: Low (cosmetic issue)

**Mitigation**:

- Only include non-default filter values in URL
- Use short parameter names (`p` instead of `page`, `q` for `keywords`)
- Consider URL shortening service for social sharing (future enhancement)

### Risk 4: Browser back/forward navigation conflicts with pagination state

**Likelihood**: Medium | **Impact**: Medium (confusing UX)

**Mitigation**:

- Ensure filter signal reacts to query param changes
- Use `replaceUrl: false` to preserve history
- Test back/forward navigation thoroughly
- Document expected behavior in tests

---

## Next Steps (Phase 1)

1. ✅ Research complete
2. → Create data model for pagination state
3. → Define API contracts (even if client-side, document expected structure)
4. → Write quickstart guide for development workflow
5. → Update agent context with pagination patterns
