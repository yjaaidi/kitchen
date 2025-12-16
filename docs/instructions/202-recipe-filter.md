---
sidebar_label: 202. Recipe Filter Component
---

# Recipe Filter Component

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 202-recipe-filter
```

## 🎯 Goal: Extract filtering logic into a separate component with custom events

The search form is currently embedded in `RecipeSearch`. Your goal is to extract it into a separate `RecipeFilter` component that communicates with its parent using custom events, and add support for filtering by maximum ingredients and steps.

### 📝 Steps

#### 1. Create the RecipeFilter component file

Create a new file `src/app/recipe-filter.ts`.

#### 2. Define types and interfaces

At the bottom of `recipe-filter.ts`, define:

```ts
export interface RecipeFilterCriteria {
  keywords?: string;
  maxIngredients?: number;
  maxSteps?: number;
}

export function createRecipeFilterCriteria(
  criteria: RecipeFilterCriteria
): RecipeFilterCriteria {
  return criteria;
}
```

#### 3. Create custom event classes

Define custom events that will carry the filter criteria:

```ts
export class RecipeFilterCriteriaChange extends Event {
  criteria: RecipeFilterCriteria;
  constructor(criteria: RecipeFilterCriteria) {
    super('criteria-change');
    this.criteria = criteria;
  }
}

export class RecipeFilterCriteriaSubmit extends Event {
  criteria: RecipeFilterCriteria;
  constructor(criteria: RecipeFilterCriteria) {
    super('criteria-submit');
    this.criteria = criteria;
  }
}
```

#### 4. Create the RecipeFilter component

```ts
/**
 * @event criteria-change - Emitted when an input's value changes
 * @event criteria-submit - Emitted when the form is submitted
 *
 * @property {RecipeFilterCriteria} criteria - The current filter criteria
 */
@customElement('wm-recipe-filter')
export class RecipeFilter extends LitElement {
  static override styles = css`
    /* styles here */
  `;

  @query('input[name="keywords"]')
  private _searchInput?: HTMLInputElement;

  @query('input[name="maxIngredients"]')
  private _maxIngredientsInput?: HTMLInputElement;

  @query('input[name="maxSteps"]')
  private _maxStepsInput?: HTMLInputElement;

  protected override render() {
    return html`
      <form
        class="search-form"
        @input=${this._handleInput}
        @submit=${this._handleSubmit}
      >
        <input name="keywords" placeholder="Search recipes" type="text" />
        <input
          min="0"
          name="maxIngredients"
          placeholder="Max ingredients"
          type="number"
        />
        <input min="0" name="maxSteps" placeholder="Max steps" type="number" />
        <button type="submit">🔍</button>
      </form>
    `;
  }

  private _handleInput() {
    this.dispatchEvent(new RecipeFilterCriteriaChange(this._buildCriteria()));
  }

  private _handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.dispatchEvent(new RecipeFilterCriteriaSubmit(this._buildCriteria()));
  }

  private _buildCriteria(): RecipeFilterCriteria {
    const keywords = this._searchInput?.value;
    const maxIngredients = _inputValueAsNumber(this._maxIngredientsInput);
    const maxSteps = _inputValueAsNumber(this._maxStepsInput);
    return createRecipeFilterCriteria({ keywords, maxIngredients, maxSteps });
  }
}

function _inputValueAsNumber(input?: HTMLInputElement) {
  const value = input?.valueAsNumber;
  if (value == null || isNaN(value)) {
    return undefined;
  }
  return value;
}
```

#### 5. Style the filter form

Use CSS Grid to layout the inputs:

```css
.search-form {
  display: grid;
  grid-template-columns: 1fr 1fr 50px;
  max-width: 600px;
  margin: 1rem auto;
  padding: 0 0.5rem;

  input {
    min-width: 100px;
    border: 1px solid #ccc;
    font-size: 1rem;
    line-height: 1.5rem;
    padding: 0.5rem 1rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &[name='keywords'] {
      border-radius: 8px 8px 0 0;
      border-bottom: none;
      grid-column: 1 / -1;
    }

    &[name='maxIngredients'] {
      border-radius: 0 0 0 8px;
      border-right: none;
    }

    &[name='maxSteps'] {
      border-right: none;
    }
  }

  button {
    border: 1px solid #ccc;
    border-radius: 0 0 8px 0;
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

#### 6. Update RecipeSearch to use RecipeFilter

In `recipe-search.ts`:

**Import the new component and types:**

```ts
import './recipe-filter';
import {
  RecipeFilterCriteriaChange,
  RecipeFilterCriteria,
} from './recipe-filter';
```

**Replace the `_keywords` state with `_criteria`:**

```ts
@state()
private _criteria?: RecipeFilterCriteria;
```

**Remove unnecessary imports:**

- Remove `query` from the decorators import
- Remove the `@query('input[name="keywords"]')` property

**Update the render method:**

Replace the form with the new component:

```ts
<wm-recipe-filter
  @criteria-change=${this._handleCriteriaChange}
></wm-recipe-filter>
```

**Update event handling:**

Replace the old handlers with:

```ts
private _handleCriteriaChange(event: RecipeFilterCriteriaChange) {
  this._criteria = event.criteria;
}
```

**Update the willUpdate method:**

```ts
protected override willUpdate(
  changedProperties: PropertyValues<{ _criteria?: RecipeFilterCriteria }>
): void {
  if (changedProperties.has('_criteria')) {
    this._updateFilteredRecipes();
  }

  super.willUpdate(changedProperties);
}
```

**Implement the new filtering logic:**

```ts
private _updateFilteredRecipes() {
  const { keywords, maxIngredients, maxSteps } = this._criteria ?? {};
  let filteredRecipes = this._recipes;

  if (keywords) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(keywords.toLowerCase())
    );
  }

  if (maxIngredients) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.ingredients.length <= maxIngredients
    );
  }

  if (maxSteps) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.steps.length <= maxSteps
    );
  }

  this._filteredRecipes = filteredRecipes;
}
```

**Remove old methods:**

- `_handleInput()`
- `_handleSubmit()`
- `_syncKeywordsFromInput()`

**Remove the `.search-form` styles** from `RecipeSearch` (they're now in `RecipeFilter`).

## 📖 Appendices

### Lit Documentation

- [Events](https://lit.dev/docs/components/events/)
- [Dispatching Events](https://lit.dev/docs/components/events/#dispatching-events)
- [Custom Events](https://lit.dev/docs/components/events/#custom-events)
- [Event Options](https://lit.dev/docs/components/events/#event-options)

### Key Concepts

**Custom Events:**

- Extend the `Event` class to create custom events
- Pass data by adding properties to your custom event class
- Use meaningful event names (kebab-case convention)

**Dispatching Events:**

```ts
this.dispatchEvent(new CustomEvent('my-event', { detail: data }));
```

Or with a custom event class:

```ts
this.dispatchEvent(new MyCustomEvent(data));
```

**Listening to Custom Events:**

```html
<my-element @my-event="${this._handleMyEvent}"></my-element>
```

**Event Handler:**

```ts
private _handleMyEvent(event: MyCustomEvent) {
  const data = event.detail; // or event.data if using custom class
}
```

**valueAsNumber:**

- HTML input elements have a `valueAsNumber` property
- Returns a number for numeric inputs
- Returns `NaN` if the input is empty or not a valid number

**Optional Chaining and Nullish Coalescing:**

```ts
// Optional chaining
const value = input?.value;

// Nullish coalescing
const criteria = this._criteria ?? {};
```

**CSS Grid:**

- `grid-template-columns: 1fr 1fr 50px` creates 3 columns
- `grid-column: 1 / -1` spans from first to last column
- Powerful for complex layouts

**Component Communication:**

- Child components dispatch events (bottom-up)
- Parent components pass properties (top-down)
- This pattern keeps components decoupled and reusable
