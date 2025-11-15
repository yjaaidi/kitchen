# API Contract: Recipe Search with Pagination

**Date**: November 15, 2025
**Purpose**: Define API contracts for recipe search with pagination support

## Current API Contract (v1)

### Endpoint

```
GET https://recipe-api.marmicode.io/recipes
```

### Request Parameters

| Parameter | Type   | Required | Description                     | Example              |
| --------- | ------ | -------- | ------------------------------- | -------------------- |
| `q`       | string | No       | Search keywords for recipe name | `?q=pasta`           |
| `embed`   | string | No       | Related entities to include     | `?embed=ingredients` |

### Response Format

```typescript
interface RecipeListResponse {
  items: RecipeDto[];
}

interface RecipeDto {
  id: string;
  created_at: string;
  name: string;
  picture_uri: string;
  ingredients?: IngredientDto[];
}

interface IngredientDto {
  id: string;
  name: string;
}
```

### Example Response

```json
{
  "items": [
    {
      "id": "recipe-001",
      "created_at": "2025-01-15T10:00:00Z",
      "name": "Spaghetti Carbonara",
      "picture_uri": "https://example.com/images/carbonara.jpg",
      "ingredients": [
        { "id": "ing-001", "name": "Spaghetti" },
        { "id": "ing-002", "name": "Eggs" },
        { "id": "ing-003", "name": "Bacon" }
      ]
    }
  ]
}
```

### Limitations

- ❌ No pagination parameters supported
- ❌ No total count in response
- ❌ Returns all matching results (unbounded)
- ❌ No page metadata

**Impact**: Requires client-side pagination implementation

---

## Client-Side Pagination Contract (Current Implementation)

Since the API doesn't support server-side pagination, we implement pagination client-side:

### Flow

```
1. Client requests all results: GET /recipes?q={keywords}&embed=ingredients
2. API returns complete result set: { items: Recipe[] }
3. Client applies local filtering (maxIngredientCount)
4. Client slices results based on page number and page size
5. Client calculates pagination metadata locally
```

### Internal Contract (RecipeRepository)

```typescript
interface RecipeRepository {
  /**
   * Search for recipes with optional filters
   * Returns ALL matching recipes (no pagination at API level)
   *
   * @param filter - Search criteria including keywords and page number
   * @returns Observable of all recipes matching filter
   */
  search(filter: RecipeFilter): Observable<Recipe[]>;
}

interface RecipeFilter {
  keywords?: string;
  maxIngredientCount?: number;
  page?: number; // Used only for client-side slicing
}
```

### Pagination Logic (Component Level)

```typescript
class RecipeSearchComponent {
  // Fetch ALL recipes matching non-pagination filters
  private allRecipes$ = rxResource({
    params: computed(() => ({
      keywords: this.filter().keywords,
      maxIngredientCount: this.filter().maxIngredientCount,
    })),
    stream: ({ params }) => this._repository.search(params),
  });

  // Slice to current page
  paginatedRecipes = computed(() => {
    const all = this.allRecipes$.value() ?? [];
    const page = this.filter().page ?? 1;
    const pageSize = 12;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return all.slice(start, end);
  });

  // Calculate pagination metadata
  paginationState = computed(() => ({
    currentPage: this.filter().page ?? 1,
    pageSize: 12,
    totalItems: this.allRecipes$.value()?.length ?? 0,
    totalPages: Math.ceil((this.allRecipes$.value()?.length ?? 0) / 12),
  }));
}
```

---

## Future API Contract (v2 - If Server-Side Pagination Added)

### Endpoint

```
GET https://recipe-api.marmicode.io/recipes
```

### Request Parameters (Extended)

| Parameter       | Type   | Required | Description           | Example              |
| --------------- | ------ | -------- | --------------------- | -------------------- |
| `q`             | string | No       | Search keywords       | `?q=pasta`           |
| `embed`         | string | No       | Related entities      | `?embed=ingredients` |
| **`page`**      | number | No       | Page number (1-based) | `?page=2`            |
| **`page_size`** | number | No       | Items per page        | `?page_size=12`      |

### Response Format (Extended)

```typescript
interface PaginatedRecipeListResponse {
  items: RecipeDto[];
  pagination: PaginationMetadata;
}

interface PaginationMetadata {
  current_page: number; // 1-based page number
  page_size: number; // Items per page
  total_items: number; // Total matching recipes
  total_pages: number; // Calculated: ceil(total_items / page_size)
}
```

### Example Response

```json
{
  "items": [
    {
      "id": "recipe-013",
      "name": "Pasta Primavera",
      "picture_uri": "https://example.com/images/primavera.jpg",
      "ingredients": [...]
    }
  ],
  "pagination": {
    "current_page": 2,
    "page_size": 12,
    "total_items": 48,
    "total_pages": 4
  }
}
```

### Migration Path

**Phase 1** (Current): Client-side pagination

- ✅ No API changes required
- ✅ Works with existing API
- ✅ Instant page navigation after initial load
- ⚠️ Fetches all results upfront

**Phase 2** (Future): Server-side pagination

- Update `RecipeRepository` to include pagination params in API request
- Parse `pagination` metadata from response
- Remove client-side slicing logic
- Reduce initial payload size
- Add server-side sorting/filtering if needed

---

## HTTP Headers (Current)

### Request Headers

```
GET /recipes?q=pasta&embed=ingredients HTTP/1.1
Host: recipe-api.marmicode.io
Accept: application/json
```

### Response Headers

```
HTTP/1.1 200 OK
Content-Type: application/json
```

**Note**: No pagination-related headers (e.g., `X-Total-Count`, `Link`) are currently returned.

---

## Error Handling

### API Errors

| Status Code | Scenario                     | Client Handling                       |
| ----------- | ---------------------------- | ------------------------------------- |
| 200         | Success with results         | Display paginated results             |
| 200         | Success with empty array     | Show "No recipes found" message       |
| 400         | Bad request (invalid params) | Log error, show user-friendly message |
| 404         | Endpoint not found           | Log error, show error state           |
| 500         | Server error                 | Show retry option                     |
| 503         | Service unavailable          | Show retry option                     |

### Client-Side Errors

| Error                | Cause                                               | Handling                           |
| -------------------- | --------------------------------------------------- | ---------------------------------- |
| Invalid page number  | User navigates to page 0, negative, or > totalPages | Redirect to page 1                 |
| Network timeout      | Slow connection                                     | Show loading state, allow retry    |
| Empty filter results | No recipes match criteria                           | Hide pagination, show "No results" |

---

## Request/Response Examples

### Example 1: Search without keywords (all recipes)

**Request**:

```
GET /recipes?embed=ingredients
```

**Response**:

```json
{
  "items": [
    { "id": "recipe-001", "name": "Burger", ... },
    { "id": "recipe-002", "name": "Pizza", ... },
    // ... 50 total recipes
  ]
}
```

**Client Processing**:

- Total items: 50
- Page size: 12
- Total pages: 5 (ceil(50/12))
- Page 1 shows items 0-11
- Page 2 shows items 12-23
- Page 5 shows items 48-49

---

### Example 2: Search with keywords

**Request**:

```
GET /recipes?q=pasta&embed=ingredients
```

**Response**:

```json
{
  "items": [
    { "id": "recipe-015", "name": "Pasta Carbonara", ... },
    { "id": "recipe-027", "name": "Pasta Primavera", ... },
    // ... 8 total pasta recipes
  ]
}
```

**Client Processing**:

- Total items: 8
- Page size: 12
- Total pages: 1 (ceil(8/12))
- Pagination controls hidden (single page)

---

### Example 3: Search with max ingredient filter

**Request**:

```
GET /recipes?embed=ingredients
```

**Response**:

```json
{
  "items": [
    { "id": "recipe-001", "name": "Burger", "ingredients": [{...}, {...}, {...}] },
    { "id": "recipe-002", "name": "Salad", "ingredients": [{...}, {...}] },
    // ... 50 recipes
  ]
}
```

**Client Processing**:

- Apply `maxIngredientCount: 3` filter client-side
- Filter: 50 recipes → 20 recipes with ≤3 ingredients
- Total items: 20
- Page size: 12
- Total pages: 2 (ceil(20/12))
- Page 1 shows 12 filtered recipes
- Page 2 shows 8 filtered recipes

---

## Data Consistency Requirements

### FR-018: No Duplicate Recipes

**Requirement**: Recipes must not appear on multiple pages

**Implementation**:

- Use array slicing with exclusive end index: `items.slice(start, end)`
- Ensure consistent ordering (API returns stable order)
- Don't re-fetch during pagination (use cached results)

**Testing**:

```typescript
it('should not show duplicate recipes across pages', async () => {
  const allRecipes = await getAllPagesRecipes();
  const recipeIds = allRecipes.map((r) => r.id);
  const uniqueIds = new Set(recipeIds);
  expect(uniqueIds.size).toBe(recipeIds.length); // No duplicates
});
```

### FR-019: No Missing Recipes

**Requirement**: All recipes must appear exactly once across all pages

**Implementation**:

- Track total count on first fetch
- Verify total across all pages matches initial count
- Use contiguous slicing (no gaps in indices)

**Testing**:

```typescript
it('should show all recipes across pages', async () => {
  const totalItems = paginationState().totalItems;
  const allPages = await getAllPagesRecipes();
  expect(allPages.length).toBe(totalItems);
});
```

---

## Performance Characteristics

### Client-Side Pagination (Current)

| Metric                     | Value                        | Notes                             |
| -------------------------- | ---------------------------- | --------------------------------- |
| Initial load time          | API response time            | Fetches all results               |
| Subsequent page navigation | ~0ms                         | Instant (slicing cached data)     |
| Memory usage               | O(n) where n = total recipes | All recipes in memory             |
| Network requests           | 1 per filter change          | Only re-fetch when filters change |
| API payload size           | ~5-10KB per recipe           | 50 recipes = 250-500KB            |

### Server-Side Pagination (Future)

| Metric                     | Value              | Notes                           |
| -------------------------- | ------------------ | ------------------------------- |
| Initial load time          | API response time  | Fetches only first page         |
| Subsequent page navigation | API response time  | ~100-500ms per page             |
| Memory usage               | O(pageSize)        | Only current page in memory     |
| Network requests           | 1 per page change  | More requests, smaller payloads |
| API payload size           | ~60-120KB per page | 12 recipes = 60-120KB           |

---

## Contract Versioning

**Current Version**: v1 (Client-side pagination)
**Future Version**: v2 (Server-side pagination support)

### Backward Compatibility

When migrating to v2:

- v1 contract (no pagination params) must still work
- If no `page` param provided, default to page 1
- If no `page_size` param provided, default to 12
- Response must include `pagination` metadata when pagination params present

### Feature Detection

```typescript
// Check if API supports server-side pagination
function supportsServerPagination(response: any): boolean {
  return 'pagination' in response;
}

// Fallback strategy
if (supportsServerPagination(response)) {
  // Use server-side pagination metadata
  return response.pagination;
} else {
  // Calculate pagination client-side
  return computeClientSidePagination(response.items);
}
```
