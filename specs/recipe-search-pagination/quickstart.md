# Quickstart: Recipe Search Pagination Development

**Date**: November 15, 2025
**Purpose**: Developer guide for implementing pagination in recipe search

## Prerequisites

- Familiarity with Angular 17+ (signals, standalone components)
- Understanding of RxJS and `rxResource`
- Access to `src/app/recipe/` directory
- Testing environment set up (Vitest, @testing-library/angular)

## Development Workflow

### Phase 1: Extend Data Types ✅

**File**: `src/app/recipe/recipe-filter.ts`

1. Add `page` property to `RecipeFilter` interface:

```typescript
export interface RecipeFilter {
  keywords?: string;
  maxIngredientCount?: number;
  page?: number; // NEW: Page number (1-based)
}
```

2. Update `createRecipeFilter()` factory to include page:

```typescript
export function createRecipeFilter(
  partial: Partial<RecipeFilter> = {}
): RecipeFilter {
  return {
    keywords: partial.keywords,
    maxIngredientCount: partial.maxIngredientCount,
    page: partial.page ?? 1 // Default to page 1
  };
}
```

**Test**: Verify `createRecipeFilter()` includes page number

---

### Phase 2: Create Pagination State Module 🔧

**File**: `src/app/recipe/pagination-state.ts` (NEW)

1. Define types and interfaces:

```typescript
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const DEFAULT_PAGE_SIZE = 12;
```

2. Implement state calculation functions:

```typescript
export function computePaginationState(
  totalItems: number,
  currentPage: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): PaginationState {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPage = Math.max(1, Math.min(currentPage, totalPages));
  
  return {
    currentPage: clampedPage,
    pageSize,
    totalItems,
    totalPages
  };
}

export function getPageItems<T>(
  allItems: T[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return allItems.slice(startIndex, endIndex);
}

export function shouldShowPagination(
  totalItems: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): boolean {
  return totalItems > pageSize;
}
```

**Test**: Create `pagination-state.spec.ts` with unit tests for each function

---

### Phase 3: Create Pagination Controls Component 🎨

**File**: `src/app/recipe/pagination-controls.ng.ts` (NEW)

1. Component setup:

```typescript
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-pagination-controls',
  imports: [MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="totalItems()"
      [pageSize]="pageSize()"
      [pageIndex]="currentPage() - 1"
      [pageSizeOptions]="[]"
      [showFirstLastButtons]="true"
      (page)="onPageChange($event)"
      aria-label="Select page of recipes">
    </mat-paginator>
  `
})
export class PaginationControls {
  totalItems = input.required<number>();
  pageSize = input.required<number>();
  currentPage = input.required<number>();
  
  pageChange = output<number>();
  
  onPageChange(event: PageEvent): void {
    // Convert 0-based index to 1-based page number
    this.pageChange.emit(event.pageIndex + 1);
  }
}
```

2. Add styles (optional):

```typescript
styles: `
  :host {
    display: block;
    margin-top: 2rem;
  }
`
```

**Test**: Create `pagination-controls.spec.ts`:
- Test page change events
- Test first/last button functionality
- Test correct page display

---

### Phase 4: Update Recipe Search Component 🔄

**File**: `src/app/recipe/recipe-search.ng.ts`

1. Add imports:

```typescript
import { computed, signal } from '@angular/core';
import { PaginationControls } from './pagination-controls.ng';
import { computePaginationState, getPageItems, shouldShowPagination } from './pagination-state';
```

2. Update filter to include page number:

```typescript
export class RecipeSearch {
  filter = signal<RecipeFilter>({ page: 1 });
  
  // Fetch ALL recipes (ignore page number for API call)
  private allRecipes = rxResource({
    params: computed(() => ({
      keywords: this.filter().keywords,
      maxIngredientCount: this.filter().maxIngredientCount
    })),
    stream: ({ params }) => this._recipeRepository.search(params),
  });
  
  // Slice to current page
  recipes = computed(() => {
    const all = this.allRecipes.value() ?? [];
    const page = this.filter().page ?? 1;
    return getPageItems(all, page);
  });
  
  // Calculate pagination state
  paginationState = computed(() => {
    const total = this.allRecipes.value()?.length ?? 0;
    const page = this.filter().page ?? 1;
    return computePaginationState(total, page);
  });
  
  // Check if pagination should be visible
  showPagination = computed(() => {
    const total = this.allRecipes.value()?.length ?? 0;
    return shouldShowPagination(total);
  });
  
  // Handle page changes
  onPageChange(page: number): void {
    this.filter.update(f => ({ ...f, page }));
  }
  
  // Handle filter changes (reset to page 1)
  onFilterChange(newFilter: Omit<RecipeFilter, 'page'>): void {
    this.filter.set({ ...newFilter, page: 1 });
  }
  
  private _recipeRepository = inject(RecipeRepository);
}
```

3. Update template:

```typescript
template: `
  <wm-recipe-filter-form (filterChange)="onFilterChange($event)" />
  
  <wm-catalog>
    @for (recipe of recipes(); track recipe.id) {
      <wm-recipe-preview [recipe]="recipe">
        <wm-recipe-add-button [recipe]="recipe" />
      </wm-recipe-preview>
    }
  </wm-catalog>
  
  @if (showPagination()) {
    <wm-pagination-controls
      [totalItems]="paginationState().totalItems"
      [pageSize]="paginationState().pageSize"
      [currentPage]="paginationState().currentPage"
      (pageChange)="onPageChange($event)" />
  }
`
```

4. Update imports in component decorator:

```typescript
imports: [
  Catalog,
  RecipeAddButton,
  RecipeFilterForm,
  RecipePreview,
  PaginationControls // NEW
],
```

**Test**: Update `recipe-search.spec.ts`:
- Test pagination appears when >12 recipes
- Test page navigation
- Test filter changes reset to page 1
- Test empty results hide pagination

---

### Phase 5: Update Repository Fake 🧪

**File**: `src/app/recipe/recipe-repository.fake.ts`

1. Update fake to handle pagination (if needed for testing):

```typescript
export class RecipeRepositoryFake implements RecipeRepositoryDef {
  private recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
  }

  search(filter: RecipeFilter = {}): Observable<Recipe[]> {
    let results = [...this.recipes];

    // Apply keyword filter
    if (filter.keywords) {
      results = results.filter(recipe =>
        recipe.name.toLowerCase().includes(filter.keywords!.toLowerCase())
      );
    }

    // Apply ingredient count filter
    if (filter.maxIngredientCount != null) {
      results = results.filter(
        recipe => recipe.ingredients.length <= filter.maxIngredientCount!
      );
    }

    // Note: Page number is NOT applied here
    // Component handles client-side slicing
    return of(results);
  }
}
```

**Test**: Verify fake returns full result set (no pagination at repository level)

---

### Phase 6: Add URL State Management (Optional P3 Feature) 🔗

**File**: `src/app/recipe/recipe-search.ng.ts`

1. Add router imports:

```typescript
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
```

2. Inject router services:

```typescript
private _router = inject(Router);
private _route = inject(ActivatedRoute);
```

3. Read query params:

```typescript
private queryParams = toSignal(this._route.queryParams, { initialValue: {} });

filter = computed(() => ({
  keywords: this.queryParams().keywords ?? undefined,
  maxIngredientCount: this.queryParams().maxIngredientCount 
    ? Number(this.queryParams().maxIngredientCount) 
    : undefined,
  page: this.queryParams().page 
    ? Number(this.queryParams().page) 
    : 1
}));
```

4. Update URL on changes:

```typescript
onPageChange(page: number): void {
  this._router.navigate([], {
    queryParams: { page },
    queryParamsHandling: 'merge',
    replaceUrl: false
  });
}

onFilterChange(newFilter: Omit<RecipeFilter, 'page'>): void {
  this._router.navigate([], {
    queryParams: { 
      ...newFilter,
      page: 1 // Reset to page 1
    },
    queryParamsHandling: 'merge',
    replaceUrl: false
  });
}
```

**Test**: 
- Verify URL updates on page change
- Verify URL updates on filter change
- Verify URL can be shared (reload with query params)

---

## Testing Strategy

### Unit Tests

**pagination-state.spec.ts**:
```typescript
import { describe, it, expect } from 'vitest';
import { computePaginationState, getPageItems, shouldShowPagination } from './pagination-state';

describe('computePaginationState', () => {
  it('should calculate correct pagination for 50 items', () => {
    const state = computePaginationState(50, 1, 12);
    
    expect(state).toEqual({
      currentPage: 1,
      pageSize: 12,
      totalItems: 50,
      totalPages: 5
    });
  });

  it('should clamp page to valid range', () => {
    const state = computePaginationState(50, 99, 12);
    
    expect(state.currentPage).toBe(5); // Max page
  });

  it('should handle empty results', () => {
    const state = computePaginationState(0, 1, 12);
    
    expect(state.totalPages).toBe(1);
  });
});

describe('getPageItems', () => {
  it('should return first page items', () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    const page1 = getPageItems(items, 1, 12);
    
    expect(page1).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('should return last page items', () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    const page5 = getPageItems(items, 5, 12);
    
    expect(page5).toEqual([48, 49]);
  });
});
```

### Component Tests

**recipe-search.spec.ts**:
```typescript
describe(RecipeSearch.name, () => {
  it('should show pagination when more than 12 recipes', async () => {
    const { mount } = await setup();
    
    t.inject(RecipeRepositoryFake).setRecipes(
      Array.from({ length: 25 }, (_, i) => 
        recipeMother.withName(`Recipe ${i}`).build()
      )
    );
    
    await mount();
    
    expect(screen.getByLabelText('Select page of recipes')).toBeInTheDocument();
  });

  it('should navigate to next page', async () => {
    const { mount } = await setup();
    
    t.inject(RecipeRepositoryFake).setRecipes(
      Array.from({ length: 25 }, (_, i) => 
        recipeMother.withName(`Recipe ${i}`).build()
      )
    );
    
    await mount();
    
    const page1Recipes = screen.getAllByRole('article');
    expect(page1Recipes).toHaveLength(12);
    
    await userEvent.click(screen.getByLabelText('Next page'));
    
    const page2Recipes = screen.getAllByRole('article');
    expect(page2Recipes).toHaveLength(13); // 25 - 12 = 13
  });

  it('should reset to page 1 when filter changes', async () => {
    const { mount } = await setup();
    
    t.inject(RecipeRepositoryFake).setRecipes(
      Array.from({ length: 25 }, (_, i) => 
        recipeMother.withName(`Recipe ${i}`).build()
      )
    );
    
    await mount();
    
    // Navigate to page 2
    await userEvent.click(screen.getByLabelText('Next page'));
    
    // Change filter
    await userEvent.type(screen.getByLabelText('Keywords'), 'pasta');
    
    // Should be back on page 1
    // Verify via URL or pagination display
  });
});
```

---

## Development Checklist

### Phase 1: Data Types
- [ ] Add `page` to `RecipeFilter` interface
- [ ] Update `createRecipeFilter()` factory
- [ ] Write tests for filter creation

### Phase 2: Pagination State
- [ ] Create `pagination-state.ts` module
- [ ] Implement `computePaginationState()`
- [ ] Implement `getPageItems()`
- [ ] Implement `shouldShowPagination()`
- [ ] Write unit tests for all functions

### Phase 3: Pagination Controls
- [ ] Create `pagination-controls.ng.ts` component
- [ ] Implement Material paginator integration
- [ ] Add page change event handling
- [ ] Write component tests

### Phase 4: Recipe Search Update
- [ ] Add pagination state to `RecipeSearch`
- [ ] Implement client-side slicing
- [ ] Update template with pagination controls
- [ ] Add page change handler
- [ ] Update filter change handler (reset to page 1)
- [ ] Update tests

### Phase 5: Repository Fake
- [ ] Verify fake returns full result set
- [ ] Update test data builders if needed

### Phase 6: URL State (Optional)
- [ ] Add router integration
- [ ] Read query params as signals
- [ ] Update URL on navigation
- [ ] Test URL persistence

### Quality Assurance
- [ ] All tests pass
- [ ] No linter errors
- [ ] OnPush change detection used
- [ ] Signals used (no effect())
- [ ] Component uses `.ng.ts` extension
- [ ] Inline templates used
- [ ] Constitution compliance verified

---

## Common Issues & Solutions

### Issue: Pagination doesn't update when filter changes

**Cause**: Filter signal not triggering recomputation

**Solution**: Ensure `allRecipes` rxResource depends on filter signals (excluding page):
```typescript
params: computed(() => ({
  keywords: this.filter().keywords,
  maxIngredientCount: this.filter().maxIngredientCount
  // Don't include page - that's handled client-side
}))
```

---

### Issue: Page numbers shown as 0, 1, 2 instead of 1, 2, 3

**Cause**: MatPaginator uses 0-based indexing

**Solution**: Convert between 0-based (Material) and 1-based (user-facing):
```typescript
[pageIndex]="currentPage() - 1"  // Display: subtract 1
(page)="onPageChange($event.pageIndex + 1)"  // Event: add 1
```

---

### Issue: Tests fail with "Cannot read property 'length' of undefined"

**Cause**: `allRecipes.value()` returns undefined during loading

**Solution**: Use nullish coalescing:
```typescript
const all = this.allRecipes.value() ?? [];
```

---

### Issue: Pagination shows when results fit on one page

**Cause**: Not checking `shouldShowPagination()`

**Solution**: Conditionally render:
```typescript
@if (showPagination()) {
  <wm-pagination-controls ... />
}
```

---

## Performance Tips

1. **Use computed signals**: Avoid manual subscriptions
2. **Cancel requests**: `rxResource` handles this automatically
3. **Slice efficiently**: Array.slice() is O(1) reference copy
4. **Memoize calculations**: Use computed() for derived state

---

## Next Steps After Implementation

1. Run full test suite: `npm test`
2. Manual testing: Test with 0, 1, 12, 13, 50, 100+ recipes
3. Test edge cases: Invalid URLs, rapid clicking, filter changes
4. Accessibility audit: Keyboard navigation, screen readers
5. Performance check: Monitor bundle size, render performance
6. Code review: Verify constitution compliance
7. Update documentation: Add examples, screenshots

---

## Reference Links

- [Angular Signals](https://angular.dev/guide/signals)
- [rxResource API](https://angular.dev/api/core/rxResource)
- [Material Paginator](https://material.angular.io/components/paginator)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library)
- [Constitution](../../.specify/memory/constitution.md)
- [Spec](./spec.md)
- [Data Model](./data-model.md)

