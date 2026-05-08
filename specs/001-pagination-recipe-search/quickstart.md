# Quickstart: Paginated Recipe Search

## Prerequisites

Node.js and npm installed. Dependencies already installed (`npm install`).

## Run the App

```bash
npx nx serve kitchen
```

Open `http://localhost:4200` and use the recipe search filters. After implementation, results will be paginated at 12 per page.

## Run Tests

```bash
# All tests (unit + browser)
npx nx test kitchen

# Watch mode
npx nx test kitchen --watch

# Run only recipe-search tests
npx nx test kitchen --reporter=verbose -- recipe-search
```

## Key Files

| File | Purpose |
|---|---|
| `src/app/recipe/recipe-search.ng.ts` | Main search component — add pagination state here |
| `src/app/shared/paginator.ng.ts` | New Paginator component to create |
| `src/app/recipe/recipe-search.browser.spec.ts` | Existing tests — add pagination scenarios |
| `src/app/shared/paginator.browser.spec.ts` | New Paginator component tests |
| `src/app/recipe/recipe-repository.fake.ts` | Seed test recipes via `setRecipes()`, simulate loading via `pause()` |
| `src/app/testing/recipe.mother.ts` | Recipe test factory — use `recipeMother.withBasicInfo('Name').build()` |

## Test Patterns

### Seed more than one page of recipes
```typescript
recipeRepoFake.setRecipes(
  Array.from({ length: 25 }, (_, i) =>
    recipeMother.withBasicInfo(`Recipe ${i + 1}`).build()
  )
);
```

### Test loading state
```typescript
recipeRepoFake.pause(); // hold the response
t.mount(RecipeSearch);
// assert loading indicator is visible
```

### Query paginator controls
```typescript
const nextBtn = page.getByRole('button', { name: 'Next' });
const prevBtn = page.getByRole('button', { name: 'Previous' });
const pageLabel = page.getByText(/Page \d+ of \d+/);
```
