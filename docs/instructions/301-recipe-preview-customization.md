---
sidebar_label: 301. Recipe Preview Customization
---

# Recipe Preview Customization

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 301-recipe-preview-customization
```

## 🎯 Goal: Add display mode selection and style customization

Your goal is to:

1. Create a reusable generic `Selector` component
2. Add a `mode` property to `RecipePreview` to support compact and detailed views
3. Use the `classMap` directive for conditional styling
4. Use CSS parts to allow external styling customization

### 📝 Steps

#### Part 1: Create the Selector Component

##### 1. Create `src/app/selector.ts`

Create a generic selector component that can work with any string-based options:

```ts
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @event value-change - Emitted when the selected value changes
 *
 * @property {T[]} options - The options to select from
 * @property {T} value - The selected value
 */
@customElement('wm-selector')
export class Selector<T extends string> extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      justify-content: center;
    }

    button {
      padding: 0.5rem 1rem;

      background: transparent;
      border: 1px solid #ccc;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s, border-color 0.2s;

      &:disabled {
        background: linear-gradient(135deg, #667eea 0%, #644ba2 100%);
        border-color: #667eea;
        color: white;
        cursor: initial;
      }

      &:first-child {
        border-radius: 8px 0 0 8px;
      }

      &:last-child {
        border-radius: 0 8px 8px 0;
      }
    }
  `;

  @property({ type: Array })
  options: T[] = [];

  @property()
  value?: T;

  protected override render() {
    return this.options.map((option) => {
      const handleClick = () => this.dispatchEvent(new SelectorChange(option));
      return html`
        <button @click=${handleClick} ?disabled=${this.value === option}>
          ${option.toUpperCase()}
        </button>
      `;
    });
  }
}

export class SelectorChange<T extends string> extends Event {
  value: T;
  constructor(value: T) {
    super('value-change');
    this.value = value;
  }
}
```

**Key points:**

- Uses TypeScript generics: `<T extends string>`
- `:host` selector styles the component's host element
- `?disabled=${condition}` is boolean attribute binding
- Creates event handler inline to capture the option value

#### Part 2: Update RecipePreview Component

##### 1. Import the classMap directive

```ts
import { classMap } from 'lit/directives/class-map.js';
```

##### 2. Add mode types and property

At the bottom of `recipe-preview.ts`:

```ts
export const RECIPE_PREVIEW_MODES = ['compact', 'detailed'] as const;

export type RecipePreviewMode = (typeof RECIPE_PREVIEW_MODES)[number];
```

In the class:

```ts
@property()
mode: RecipePreviewMode = 'detailed';
```

##### 3. Extract the ingredients template

Before the `return` statement in `render()`:

```ts
const ingredientsTpl = html`<ul class="ingredients">
  ${this.recipe.ingredients.map(
    (ingredient) => html`<li>
      ${ingredient.quantity
        ? html`${ingredient.quantity.amount} ${ingredient.quantity.unit} `
        : nothing} ${ingredient.name}
    </li>`
  )}
</ul>`;
```

##### 4. Use classMap for conditional styling

Replace the `class="recipe"` with:

```ts
class=${classMap({ recipe: true, compact: this.mode === 'compact' })}
```

This applies the `compact` class only when mode is 'compact'.

##### 5. Add conditional rendering for ingredients

Replace the ingredients `<ul>` in the template with:

```ts
${this.mode === 'compact'
  ? html`<details>
      <summary>Ingredients</summary>
      ${ingredientsTpl}
    </details>`
  : ingredientsTpl}
```

##### 6. Add a CSS part for the name

Add `part="name"` to the name heading:

```ts
<h2 class="name" part="name">
  ${this.recipe.name}
</h2>
```

##### 7. Add compact mode styles

Add these styles to the existing `styles`:

```css
.compact {
  &.recipe {
    max-width: 300px;
  }

  .image {
    max-height: 100px;
  }

  summary {
    cursor: pointer;
    font-style: italic;
  }
}
```

#### Part 3: Update RecipeSearch Component

##### 1. Import the selector and types

```ts
import './selector';
import { SelectorChange } from './selector';
import { RECIPE_PREVIEW_MODES, RecipePreviewMode } from './recipe-preview';
```

##### 2. Add state for preview mode

```ts
@state()
private _recipePreviewMode: RecipePreviewMode = 'detailed';
```

##### 3. Add the selector to the template

Add this between the filter and the recipe list:

```ts
<wm-selector
  .options=${RECIPE_PREVIEW_MODES}
  .value=${this._recipePreviewMode}
  @value-change=${this._handleRecipePreviewModeChange}
></wm-selector>
```

##### 4. Pass mode to RecipePreview

Update the recipe preview element:

```ts
<wm-recipe-preview
  .mode=${this._recipePreviewMode}
  .recipe=${recipe}
></wm-recipe-preview>
```

##### 5. Add event handler

```ts
private _handleRecipePreviewModeChange(
  event: SelectorChange<RecipePreviewMode>
) {
  this._recipePreviewMode = event.value;
}
```

##### 6. Style the recipe name using CSS parts

Add this to the styles:

```css
wm-recipe-preview::part(name) {
  color: #59258c;
  font-family: Cursive;
}
```

## 📖 Appendices

### Lit Documentation

- [classMap Directive](https://lit.dev/docs/templates/directives/#classmap)
- [Boolean Attributes](https://lit.dev/docs/templates/expressions/#boolean-attribute-expressions)
- [CSS Parts](https://lit.dev/docs/components/styles/#parts)
- [:host Selector](https://lit.dev/docs/components/styles/#host)

### Key Concepts

**classMap Directive:**

- Conditionally applies CSS classes based on an object
- Object keys are class names, values are boolean conditions
- More readable than manual string concatenation

```ts
class=${classMap({
  'base-class': true,
  'active': isActive,
  'disabled': isDisabled
})}
```

**Boolean Attribute Binding:**

- Use `?` prefix for boolean attributes
- Adds/removes the attribute based on the expression

```ts
?disabled=${isDisabled}
?hidden=${!isVisible}
```

**Template Variables:**

- Extract complex templates into variables
- Improves readability
- Allows template reuse

```ts
const myTemplate = html`<div>...</div>`;
return html`${condition ? myTemplate : otherTemplate}`;
```

**CSS Parts:**

- Allow external styling of internal elements
- Use `part="part-name"` attribute inside the component
- Style from outside with `::part(part-name)` selector
- Provides controlled customization points

```ts
// Inside component
html`<h2 part="title">${title}</h2>`;

// Outside component (in parent's styles)
css`
  my-component::part(title) {
    color: red;
  }
`;
```

**:host Selector:**

- Styles the component's host element itself
- Only works in component's shadow DOM styles
- Can be used with pseudo-classes: `:host(:hover)`, `:host([attr])`

**TypeScript Generics in Lit:**

- Components can use generic type parameters
- Useful for creating reusable components
- Type safety for properties and events

```ts
export class MyComponent<T extends SomeType> extends LitElement {
  @property()
  value?: T;
}
```

**Const Assertions:**

- `as const` creates a readonly tuple type
- Enables literal type inference

```ts
const MODES = ['compact', 'detailed'] as const;
type Mode = (typeof MODES)[number]; // 'compact' | 'detailed'
```

**HTML Details/Summary:**

- Native HTML elements for expandable content
- `<details>` is the container, `<summary>` is the clickable header
- No JavaScript needed for basic expand/collapse
