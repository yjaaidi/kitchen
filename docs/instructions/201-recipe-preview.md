---
sidebar_label: 201. Recipe Preview Component
---

# Recipe Preview Component

## Setup

```sh
pnpm cook start 201-recipe-preview
```

## 🎯 Goal: Extract recipe display logic into a reusable component

The `RecipeSearch` component is doing too much - it handles both search functionality and recipe rendering. Your goal is to extract the recipe display logic into a separate, reusable `RecipePreview` component.

### 📝 Steps

#### 1. Create `RecipePreview` component in `src/app/recipe-preview.ts`.

```ts
@customElement('wm-recipe-preview')
export class RecipePreview extends LitElement {
  @property()
  recipe?: Recipe;

  // TODO
}
```

#### 2. Move the recipe preview template from `RecipeSearch` to `RecipePreview`.

#### 3. Move the recipe preview styles to `RecipePreview`

#### 4. Import the new component in RecipeSearch

Add the import at the top of `recipe-search.ts`:

```ts
import './recipe-preview';
```

#### 6. Use the `RecipePreview` component

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

**Importing components:**

- Side-effect imports (`import './component'`) register custom elements
- No need to import the class if you're just using the HTML tag

**JSDoc comments:**

- Document component properties for better developer experience
