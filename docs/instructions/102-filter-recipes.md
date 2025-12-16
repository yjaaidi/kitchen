---
sidebar_label: 102. Filter Recipes
---

# Filter Recipes

## Setup

```sh
pnpm cook start 102-filter-recipes
pnpm start
```

## 🎯 Goal: Filter recipes based on search keywords

The `RecipeSearch` component already has a search form, but it doesn't do anything yet. Your goal is to implement filtering functionality that filters recipes based on the search keywords entered by the user.

### 📝 Steps

#### 1. Add listeners for input and/or submit events

Add `@input` and/or `@submit` event listeners to the search form:

```ts
<form
  @input=${this._handleInput}
  @submit=${this._handleSubmit}
>
```

#### 2. Grab a reference to the keywords input

Add a query to reference the search input element:

```ts
@query('input[name="keywords"]')
private _keywordsInput?: HTMLInputElement;
```

#### 3. Implement the handler methods

Implement the handler methods to sync the `_keywords` property from the value of `this._keywordsInput.value`:

```ts
private _handleInput() {
  // TODO
}

private _handleSubmit(event: SubmitEvent) {
  // TODO
}
```

#### 4. Implement the filtering derivation logic with `willUpdate()` lifecycle hook

Override the `willUpdate()` lifecycle method to filter recipes when keywords change:

```ts
protected override willUpdate(changedProperties: PropertyValues<{ _keywords?: string }>): void {
  if (changedProperties.has('_keywords')) {
    // TODO: filter recipes based on the keywords
  }
}
```

#### 5. Render filtered recipes instead of all recipes

In the `render()` method, replace `this._recipes` with `this._filteredRecipes`:

```ts
${this._filteredRecipes.map(
  (recipe) => html`
    <!-- recipe template -->
  `
)}
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

:::warning
Don't forget to set it on properties that you want to be reactive
:::

**@query() decorator:**

- Puts a reference to a DOM element in the component's template in the property
- Uses CSS selector syntax

**willUpdate() lifecycle method:**

- Called before rendering
- Perfect place to compute values based on property changes
- Use `changedProperties` to check which properties changed

**Event handling:**

- Use `@eventname` syntax to attach event listeners

:::warning
Don't forget to `event.preventDefault()` on form submission
:::
