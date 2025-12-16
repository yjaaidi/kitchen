---
sidebar_label: 201. Recipe Preview Component
---

# Recipe Preview Component

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 201-recipe-preview
```

## 🎯 Goal: Extract recipe display logic into a reusable component

The `RecipeSearch` component is doing too much - it handles both search functionality and recipe rendering. Your goal is to extract the recipe display logic into a separate, reusable `RecipePreview` component.

### 📝 Steps

#### 1. Create a new component file

Create a new file `src/app/recipe-preview.ts`.

#### 2. Define the RecipePreview component

Create a new Lit component with the following structure:

```ts
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Recipe } from './recipe';

/**
 * @property {Recipe} recipe - The recipe to display
 */
@customElement('wm-recipe-preview')
export class RecipePreview extends LitElement {
  static override styles = css`
    /* styles here */
  `;

  @property()
  recipe?: Recipe;

  protected override render() {
    if (!this.recipe) {
      return;
    }

    return html` <!-- recipe template here --> `;
  }
}
```

#### 3. Move the recipe styles

Move the following styles from `RecipeSearch` to `RecipePreview`:

- `.recipe`
- `.image`
- `.content`
- `.name`
- `.description`
- `.ingredients`
- `.steps`
- `.section-title`

#### 4. Move the recipe template

Move the recipe card template from `RecipeSearch` to `RecipePreview`. The template should include:

- The recipe image
- Recipe name
- Recipe description
- Ingredients list

**Important:** Use `nothing` instead of `null` for conditional rendering:

```ts
${ingredient.quantity
  ? html`${ingredient.quantity.amount} ${ingredient.quantity.unit} `
  : nothing}
```

#### 5. Import the new component in RecipeSearch

Add the import at the top of `recipe-search.ts`:

```ts
import './recipe-preview';
```

#### 6. Use the RecipePreview component

Replace the complex recipe template in `RecipeSearch` with the new component:

```ts
<ul class="recipe-list">
  $
  {this._filteredRecipes.map(
    (recipe) =>
      html` <wm-recipe-preview .recipe=${recipe}></wm-recipe-preview> `
  )}
</ul>
```

**Note:** The `.recipe=${recipe}` syntax uses property binding (the dot prefix) to pass the recipe object as a property rather than an attribute.

#### 7. Remove unnecessary styles from RecipeSearch

Remove the recipe-related styles from `RecipeSearch` since they're now in `RecipePreview`. Keep only:

- `.search-form`
- `.toolbar`
- `.title`
- `.recipe-list`

## 📖 Appendices

### Lit Documentation

- [Components](https://lit.dev/docs/components/overview/)
- [Properties](https://lit.dev/docs/components/properties/)
- [Property Decorator](https://lit.dev/docs/components/decorators/#property)
- [Composition](https://lit.dev/docs/composition/overview/)

### Key Concepts

**@property() decorator:**

- Makes a class field a reactive property
- When the property changes, the component re-renders
- Can be set from outside the component

**Property binding vs attribute binding:**

```ts
// Property binding (passes objects, arrays, etc.)
<my-element .myProp=${data}></my-element>

// Attribute binding (passes strings only)
<my-element myAttr=${stringValue}></my-element>
```

**nothing vs null:**

- Use `nothing` from Lit for conditional rendering
- It's more explicit and optimized for Lit templates

**Component composition:**

- Breaking down complex components into smaller, reusable ones
- Each component should have a single responsibility
- Improves maintainability and testability

**Importing components:**

- Side-effect imports (`import './component'`) register custom elements
- No need to import the class if you're just using the HTML tag

**JSDoc comments:**

- Document component properties for better developer experience
- Helps with IDE autocomplete and type checking
