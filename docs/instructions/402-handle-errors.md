---
sidebar_label: 402. Handle Errors
---

# Handle Errors

## Setup

```sh
pnpm cook start 402-handle-errors
pnpm start
```

## 🎯 Goal: Add error handling and display user-friendly error messages

Your goal is to handle fetch errors gracefully by catching them, storing the error state, and displaying a user-friendly error message with a retry button.

### 📝 Steps

#### 1. Add error state

Add a state property to track errors:

```ts
@state()
private _error?: unknown;
```

#### 2. Add try/catch to fetch method

Wrap the fetch call in try/catch and manage error state:

```ts
private async _fetchRecipes() {
  try {
    this._recipes = await recipeRepository.searchRecipes(this._criteria);
    this._error = undefined;
  } catch (error) {
    this._recipes = [];
    this._error = error;
  }
}
```

#### 3. Use the `when` directive for conditional rendering

Replace the recipe list with conditional rendering using the `when` directive:

```ts
${when(
  this._error,
  () => html`<div class="error" role="alert">
    <img src="https://marmicode.io/assets/error.gif" alt="Error" />
    <p>Oups, something went wrong.</p>
    <button @click=${this._fetchRecipes}>RETRY</button>
  </div>`,
  () =>
    html`...content...`
)}
```
