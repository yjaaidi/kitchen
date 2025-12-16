---
sidebar_label: 203. Two-Way Binding
---

# Two-Way Binding

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 203-recipe-filter-two-way-binding
```

## 🎯 Goal: Implement two-way data binding between parent and child

Currently, the `RecipeFilter` component only sends data up to its parent via events (one-way communication). Your goal is to also accept criteria from the parent, allowing the parent to control the filter values, enabling true two-way binding.

### 📝 Steps

#### 1. Add a criteria property to RecipeFilter

In `recipe-filter.ts`, add a property to accept criteria from the parent:

```ts
@property()
criteria?: RecipeFilterCriteria;
```

Don't forget to import `property` from `lit/decorators.js`:

```ts
import { customElement, property, query } from 'lit/decorators.js';
```

#### 2. Bind the criteria to input values

Update the `render()` method in `RecipeFilter` to extract and bind the criteria values to the inputs:

```ts
protected override render() {
  const { keywords, maxIngredients, maxSteps } = this.criteria ?? {};
  return html`
    <form
      class="search-form"
      @input=${this._handleInput}
      @submit=${this._handleSubmit}
    >
      <input
        name="keywords"
        placeholder="Search recipes"
        type="text"
        .value=${keywords ?? ''}
      />
      <input
        min="0"
        name="maxIngredients"
        placeholder="Max ingredients"
        type="number"
        .value=${maxIngredients?.toString() ?? ''}
      />
      <input
        min="0"
        name="maxSteps"
        placeholder="Max steps"
        type="number"
        .value=${maxSteps?.toString() ?? ''}
      />
      <button type="submit">🔍</button>
    </form>
  `;
}
```

**Important notes:**

- Use property binding (`.value=`) not attribute binding (`value=`)
- Convert numbers to strings using `.toString()`
- Use nullish coalescing (`??`) to provide empty string defaults

#### 3. Pass criteria from parent to child

In `recipe-search.ts`, update the `RecipeFilter` usage to pass the criteria property:

```ts
<wm-recipe-filter
  .criteria=${this._criteria}
  @criteria-change=${this._handleCriteriaChange}
></wm-recipe-filter>
```

## 📖 Appendices

### Lit Documentation

- [Properties](https://lit.dev/docs/components/properties/)
- [Two-Way Binding](https://lit.dev/docs/templates/expressions/#two-way-binding)
- [Property Binding](https://lit.dev/docs/templates/expressions/#property-expressions)

### Key Concepts

**Two-Way Binding:**

- Parent passes data down via properties (`.prop=${value}`)
- Child sends data up via events (`@event=${handler}`)
- Together, they create a two-way data flow

**Data Flow Pattern:**

```
Parent Component (RecipeSearch)
  |
  | .criteria=${this._criteria}    (data down)
  v
Child Component (RecipeFilter)
  |
  | @criteria-change event          (data up)
  v
Parent Component (RecipeSearch)
```

**Property vs Attribute Binding:**

```ts
// Property binding - passes any JavaScript value
.value=${someValue}

// Attribute binding - converts to string
value=${someValue}
```

**Why use property binding for input values:**

- Direct property assignment on the DOM element
- Works for any type (objects, arrays, numbers, etc.)
- For input elements, `.value` sets the actual value property
- More reliable than attribute binding for dynamic values

**Number to String Conversion:**

- Input elements expect string values
- Use `.toString()` to convert numbers
- Handle undefined/null with `??` operator:

```ts
.value=${myNumber?.toString() ?? ''}
```

**Controlled vs Uncontrolled Components:**

- **Uncontrolled:** Component manages its own state internally
- **Controlled:** Component receives its state from parent (what we're doing here)
- Controlled components are more predictable and testable
- Parent has full control over the component's state

**Why Two-Way Binding is Useful:**

- Parent can programmatically set filter values
- Easier to implement features like "Reset filters" button
- Parent can save/restore filter state (e.g., from URL or localStorage)
- Better for complex state management scenarios

**Destructuring with Defaults:**

```ts
const { keywords, maxIngredients, maxSteps } = this.criteria ?? {};
```

This pattern:

1. Uses nullish coalescing to default to empty object if `criteria` is undefined
2. Destructures the properties (they'll be undefined if not present)
3. Cleaner than multiple optional chaining expressions
