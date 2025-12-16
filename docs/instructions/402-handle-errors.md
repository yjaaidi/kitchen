---
sidebar_label: 402. Handle Errors
---

# Handle Errors

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 402-handle-errors
```

## 🎯 Goal: Add error handling and display user-friendly error messages

Your goal is to handle fetch errors gracefully by catching them, storing the error state, and displaying a user-friendly error message with a retry button.

### 📝 Steps

#### 1. Import the when directive

Add the import at the top of `recipe-search.ts`:

```ts
import { when } from 'lit/directives/when.js';
```

#### 2. Add error state

Add a state property to track errors:

```ts
@state()
private _error?: unknown;
```

**Why `unknown`?**

- Safer than `any` - forces type checking before use
- Errors can be anything (Error, string, number, etc.)

#### 3. Add error styles

Add styling for the error message:

```css
.error {
  text-align: center;
  color: var(--text-color);
}
```

#### 4. Use the when directive for conditional rendering

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
    html`<ul class="recipe-list">
      ${this._recipes.map(
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
    </ul>`
)}
```

**Key points:**

- First argument: condition to check
- Second argument: template when condition is truthy
- Third argument: template when condition is falsy
- Use arrow functions `() => html\`...\`` for lazy evaluation

#### 5. Add try/catch to fetch method

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

**Important:**

- Clear `_error` on success
- Clear `_recipes` on error
- Store the error for debugging/logging

## 📖 Appendices

### Lit Documentation

- [when Directive](https://lit.dev/docs/templates/directives/#when)
- [Conditional Rendering](https://lit.dev/docs/templates/conditionals/)

### MDN Documentation

- [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [unknown type (TypeScript)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)

### Key Concepts

**when() Directive:**

- More efficient than ternary operator for large templates
- Lazy evaluation - only renders the active branch
- Better readability for complex conditionals

```ts
// Without when
${this._error ? html`<error>` : html`<content>`}

// With when
${when(
  this._error,
  () => html`<error>`,
  () => html`<content>`
)}
```

**Why when() over ternary:**

- Avoids evaluating both branches
- Better performance for expensive templates
- Clearer intent
- No need for nested ternaries

**Error Handling with async/await:**

```ts
try {
  const result = await asyncOperation();
  // Handle success
} catch (error) {
  // Handle error
} finally {
  // Always runs (cleanup)
}
```

**unknown vs any:**

- `any` disables type checking (dangerous)
- `unknown` requires type checking before use (safe)
- Best practice: use `unknown` for error types

```ts
// With unknown
catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message); // TypeScript knows it's an Error
  }
}

// With any (avoid!)
catch (error: any) {
  console.log(error.message); // No type safety
}
```

**Retry Pattern:**

- Store the error state
- Display retry button
- Reuse the same fetch method
- Clear error on retry attempt

**User Experience Best Practices:**

- Always show user-friendly error messages
- Never expose technical details to users
- Provide a way to recover (retry button)
- Use appropriate ARIA roles (`role="alert"`)

**Error State Management:**

```ts
// Success: clear error
this._error = undefined;
this._data = result;

// Error: clear data
this._data = [];
this._error = error;
```

**Displaying Error Details (optional):**

```ts
${when(
  this._error,
  () => html`<div class="error">
    <p>Something went wrong</p>
    ${when(
      this._error instanceof Error,
      () => html`<pre>${this._error.message}</pre>`
    )}
  </div>`
)}
```

**Network Error Types:**

- `TypeError`: Network failure, CORS, invalid URL
- `Error`: API returned error response
- Other: Parsing errors, timeout, etc.

**Advanced Error Handling:**

```ts
private async _fetchRecipes() {
  try {
    this._loading = true;
    const response = await recipeRepository.searchRecipes(this._criteria);

    // Validate response
    if (!Array.isArray(response)) {
      throw new Error('Invalid response format');
    }

    this._recipes = response;
    this._error = undefined;
  } catch (error) {
    this._recipes = [];

    // Categorize errors
    if (error instanceof TypeError) {
      this._error = 'Network error. Please check your connection.';
    } else if (error instanceof Error) {
      this._error = error.message;
    } else {
      this._error = 'An unexpected error occurred.';
    }

    // Log for debugging
    console.error('Failed to fetch recipes:', error);
  } finally {
    this._loading = false;
  }
}
```

**Loading + Error + Success Pattern:**

```ts
@state() private _loading = false;
@state() private _error?: string;
@state() private _data?: Data;

render() {
  return when(
    this._loading,
    () => html`<loading-spinner></loading-spinner>`,
    () => when(
      this._error,
      () => html`<error-message .error=${this._error}></error-message>`,
      () => html`<data-display .data=${this._data}></data-display>`
    )
  );
}
```

**Accessibility:**

- Use `role="alert"` for error messages
- Ensures screen readers announce errors
- Use semantic HTML (`<button>` not `<div>`)
