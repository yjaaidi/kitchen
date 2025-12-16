---
sidebar_label: 401. Fetch Recipes from API
---

# Fetch Recipes from API

## Setup

```sh
pnpm cook start 401-fetch-recipes
pnpm start
```

## 🎯 Goal: Fetch recipes from a remote service instead of using hardcoded data

Your goal is to replace the hardcoded recipe list with data fetched from a remote service. The filtering logic will move from the client to the server, and the component will fetch new results whenever the filter criteria change.

### 📝 Steps

#### 1. Remove hardcoded data

#### 2. Make `_recipes` reactive

**Important:** Add `@state()` decorator so the component re-renders when recipes are fetched.

#### 3. Remove filtered recipes state

Delete the `_filteredRecipes` state property - we no longer need client-side filtering.

#### 4. Update the render method

Replace `_filteredRecipes` with `_recipes`:

#### 5. Fetch recipes on initial load

Override the `connectedCallback()` lifecycle method to fetch recipes when the component is added to the DOM:

```ts
override connectedCallback() {
  super.connectedCallback();
  this._fetchRecipes();
}
```

**Important:** Always call `super.connectedCallback()` first.

#### 6. Fetch recipes when criteria change

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
}
```

#### 7. Add the fetch method

Replace `_updateFilteredRecipes()` with an async method that fetches from the API:

```ts
private async _fetchRecipes() {
  // TODO: use `recipeRepository.searchRecipes` to fetch recipes
}
```

## 📖 Appendices

- [Lifecycle (Lit)](https://lit.dev/docs/components/lifecycle/)
- [connectedCallback (Lit)](https://lit.dev/docs/components/lifecycle/#connectedcallback)
- [Reactive Properties (Lit)](https://lit.dev/docs/components/properties/)
- [Fetch API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Using Fetch (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
