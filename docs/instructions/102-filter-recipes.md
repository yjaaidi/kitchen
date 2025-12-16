---
sidebar_label: 102. Filter Recipes
---

# Filter Recipes

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 102-filter-recipes
```

## 🎯 Goal: Filter recipes based on search keywords

The `RecipeSearch` component already has a search form, but it doesn't do anything yet. Your goal is to implement filtering functionality that filters recipes based on the search keywords entered by the user.

### 📝 Steps

#### 1. Import additional decorators and types

Update the imports in `src/app/recipe-search.ts`:

```ts
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
```

#### 2. Add state properties

Add reactive state properties to track the search keywords and filtered recipes:

```ts
@state()
private _keywords?: string;

@state()
private _filteredRecipes: Recipe[] = this._recipes;
```

#### 3. Add a query to reference the search input

Use the `@query()` decorator to get a reference to the search input element:

```ts
@query('input[name="keywords"]')
private _searchInput?: HTMLInputElement;
```

#### 4. Render filtered recipes instead of all recipes

In the `render()` method, replace `this._recipes` with `this._filteredRecipes`:

```ts
${this._filteredRecipes.map(
  (recipe) => html`
    <!-- recipe template -->
  `
)}
```

#### 5. Add event handlers to the form

Add `@input` and `@submit` event listeners to the search form:

```ts
<form
  class="search-form"
  @input=${this._handleInput}
  @submit=${this._handleSubmit}
>
```

#### 6. Implement event handler methods

Create methods to handle input and submit events:

```ts
private _handleInput() {
  this._syncKeywordsFromInput();
}

private _handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  this._syncKeywordsFromInput();
}

private _syncKeywordsFromInput() {
  this._keywords = this._searchInput?.value;
}
```

#### 7. Implement the filtering logic with `willUpdate()`

Override the `willUpdate()` lifecycle method to filter recipes when keywords change:

```ts
protected override willUpdate(changedProperties: PropertyValues): void {
  if (changedProperties.has('_keywords')) {
    this._filteredRecipes = this._recipes.filter((recipe) => {
      if (!this._keywords) {
        return true;
      }
      return recipe.name.toLowerCase().includes(this._keywords.toLowerCase());
    });
  }
  super.willUpdate(changedProperties);
}
```

#### 8. [Optional] Enhance the search form styles

Add enhanced styling for the search form with focus states:

```css
.search-form {
  display: flex;
  max-width: 400px;
  margin: 1rem auto;

  input {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 8px 0 0 8px;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
      background: #fff;
    }
  }

  button {
    border: 1px solid #ccc;
    border-left: none;
    border-radius: 0 8px 8px 0;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:hover {
      border-color: #999;
    }
  }
}
```

## 📖 Appendices

### Lit Documentation

- [Reactive Properties](https://lit.dev/docs/components/properties/)
- [State Decorator](https://lit.dev/docs/components/decorators/#state)
- [Query Decorator](https://lit.dev/docs/components/decorators/#query)
- [Lifecycle](https://lit.dev/docs/components/lifecycle/)
- [Event Listeners](https://lit.dev/docs/components/events/#adding-event-listeners-in-the-template)

### Key Concepts

**@state() decorator:**

- Marks a property as internal reactive state
- When changed, triggers a component re-render
- Not intended to be set from outside the component

**@query() decorator:**

- Returns a reference to a DOM element in the component's template
- Uses CSS selector syntax

**willUpdate() lifecycle method:**

- Called before `update()` and `render()`
- Perfect place to compute values based on property changes
- Use `changedProperties` to check which properties changed

**Event handling:**

- Use `@eventname` syntax to attach event listeners
- Don't forget to `event.preventDefault()` on form submission

**Filtering arrays:**

```ts
const filtered = items.filter((item) => condition);
```

**Case-insensitive string matching:**

```ts
str.toLowerCase().includes(search.toLowerCase());
```
