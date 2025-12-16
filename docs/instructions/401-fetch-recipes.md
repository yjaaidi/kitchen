---
sidebar_label: 401. Fetch Recipes from API
---

# Fetch Recipes from API

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 401-fetch-recipes
```

## 🎯 Goal: Fetch recipes from a REST API instead of using hardcoded data

Your goal is to replace the hardcoded recipe list with data fetched from a REST API. The filtering logic will move from the client to the server, and the component will fetch new results whenever the filter criteria change.

### 📝 Steps

#### Part 1: Update RecipeRepository

##### 1. Add default parameter value

In `recipe-repository.ts`, add a default value to the `searchRecipes` method parameter:

```ts
async searchRecipes(
  filterCriteria: RecipeFilterCriteria = {}
): Promise<Recipe[]> {
```

This allows calling the method without arguments: `searchRecipes()`.

#### Part 2: Update RecipeSearch Component

##### 1. Remove hardcoded data

In `recipe-search.ts`:

**Remove the import:**

```ts
import { createRecipe, Recipe } from './recipe';
```

Should become:

```ts
import { Recipe } from './recipe';
```

**Add the repository import:**

```ts
import { recipeRepository } from './recipe-repository';
```

##### 2. Initialize recipes as empty array with state

Replace the hardcoded `_recipes` array with an empty state array:

```ts
@state()
private _recipes: Recipe[] = [];
```

**Important:** Add `@state()` decorator so the component re-renders when recipes are fetched.

##### 3. Remove filtered recipes state

Delete the `_filteredRecipes` state property - we no longer need client-side filtering.

##### 4. Update the render method

Replace `_filteredRecipes` with `_recipes`:

```ts
<ul class="recipe-list">
  $
  {this._recipes.map(
    (recipe) =>
      html`<wm-recipe-preview
        .mode=${this._recipePreviewMode}
        .recipe=${recipe}
      >
        <button
          slot="actions"
          data-recipe-id=${recipe.id}
          @click=${this._handleAddToMealPlanner}
        >
          ADD
        </button>
      </wm-recipe-preview>`
  )}
</ul>
```

##### 5. Add criteria-submit listener

Add a listener for the submit event on the recipe filter:

```html
<wm-recipe-filter
  .criteria="${this._criteria}"
  @criteria-change="${this._handleCriteriaChange}"
  @criteria-submit="${this._fetchRecipes}"
></wm-recipe-filter>
```

##### 6. Fetch recipes on initial load

Override the `connectedCallback()` lifecycle method to fetch recipes when the component is added to the DOM:

```ts
override connectedCallback() {
  super.connectedCallback();
  this._fetchRecipes();
}
```

**Important:** Always call `super.connectedCallback()` first.

##### 7. Fetch recipes when criteria change

Update the `willUpdate()` method to fetch recipes instead of filtering locally:

```ts
protected override willUpdate(
  changedProperties: PropertyValues<{
    _criteria?: RecipeFilterCriteria;
  }>
): void {
  if (changedProperties.has('_criteria')) {
    this._fetchRecipes();
  }

  super.willUpdate(changedProperties);
}
```

##### 8. Add the fetch method

Replace `_updateFilteredRecipes()` with an async method that fetches from the API:

```ts
private async _fetchRecipes() {
  this._recipes = await recipeRepository.searchRecipes(this._criteria ?? {});
}
```

**Key points:**

- Use `async` keyword to enable `await`
- Use `await` to wait for the promise to resolve
- Pass the criteria (or empty object if undefined)
- Assign the result to `_recipes` (triggers re-render due to `@state()`)

## 📖 Appendices

### Lit Documentation

- [Lifecycle](https://lit.dev/docs/components/lifecycle/)
- [connectedCallback](https://lit.dev/docs/components/lifecycle/#connectedcallback)
- [Reactive Properties](https://lit.dev/docs/components/properties/)

### MDN Documentation

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### Key Concepts

**Async/Await:**

- `async` function always returns a Promise
- `await` pauses execution until Promise resolves
- Only works inside `async` functions
- Makes asynchronous code look synchronous

```ts
// Without await
function getRecipes() {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => process(data));
}

// With await (cleaner!)
async function getRecipes() {
  const response = await fetch(url);
  const data = await response.json();
  return process(data);
}
```

**Fetch API:**

- Modern API for making HTTP requests
- Returns a Promise
- Built into modern browsers
- Simpler than XMLHttpRequest

```ts
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

**Component Lifecycle:**

- `connectedCallback()`: Called when component is added to DOM
- Perfect place for initial data fetching
- Always call `super.connectedCallback()` first
- Pairs with `disconnectedCallback()` for cleanup

```ts
override connectedCallback() {
  super.connectedCallback();
  // Initialize, fetch data, add event listeners
}

override disconnectedCallback() {
  super.disconnectedCallback();
  // Cleanup, remove event listeners, cancel requests
}
```

**Why fetch in willUpdate:**

- `willUpdate()` is called before every render
- Check `changedProperties` to avoid unnecessary fetches
- Use `has()` method to check if a specific property changed

```ts
protected override willUpdate(changedProperties: PropertyValues) {
  if (changedProperties.has('userId')) {
    this._fetchUserData();
  }
}
```

**State Management:**

- Use `@state()` for internal reactive state
- Component re-renders when state changes
- Asynchronous updates work naturally:

```ts
@state()
private _data: Data[] = [];

async fetchData() {
  this._data = await api.getData(); // Re-renders when assigned
}
```

**Error Handling (not in this exercise, but important):**

```ts
private async _fetchRecipes() {
  try {
    this._recipes = await recipeRepository.searchRecipes(this._criteria ?? {});
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    // Show error message to user
  }
}
```

**Loading States (not in this exercise, but common pattern):**

```ts
@state()
private _loading = false;

async _fetchRecipes() {
  this._loading = true;
  try {
    this._recipes = await recipeRepository.searchRecipes(this._criteria ?? {});
  } finally {
    this._loading = false;
  }
}
```

**Server-Side vs Client-Side Filtering:**

- **Server-side**: Faster for large datasets, reduces bandwidth
- **Client-side**: Faster for small datasets, works offline
- **Hybrid**: Fetch once, filter locally for instant feedback

**Nullish Coalescing with API Calls:**

```ts
// Pass empty object if criteria is undefined
searchRecipes(this._criteria ?? {});

// Equivalent to:
searchRecipes(
  this._criteria !== null && this._criteria !== undefined ? this._criteria : {}
);
```

**Type Safety with Async:**

```ts
async searchRecipes(criteria: Criteria): Promise<Recipe[]> {
  // TypeScript knows return type is Promise<Recipe[]>
  const response = await fetch(url);
  const data = await response.json();
  return data; // Must be Recipe[]
}
```
