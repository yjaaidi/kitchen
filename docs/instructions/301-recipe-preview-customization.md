---
sidebar_label: 301. Recipe Preview Customization
---

# Recipe Preview Customization

## Setup

```sh
pnpm cook start 301-recipe-preview-customization
pnpm start
```

## 🎯 Goal: Add display mode selection and style customization

Your goal is to:

1. Add a `mode` property to `RecipePreview` to support compact and detailed views
2. Use CSS parts to allow external styling customization

### 📝 Steps

#### 1. Add mode constants and type to `recipe-preview.ts`

```ts
export const RECIPE_PREVIEW_MODES = ['compact', 'detailed'] as const;
export type RecipePreviewMode = (typeof RECIPE_PREVIEW_MODES)[number];
```

#### 2. Add a `mode` selector to `RecipeSearch`

```ts
<wm-selector
  .options=${RECIPE_PREVIEW_MODES}
  .value=${this._recipePreviewMode}
  @value-change=${this._handleRecipePreviewModeChange}
></wm-selector>
```

#### 3. Handle the mode change event in `RecipeSearch`

#### 4. Forward the mode to `RecipePreview`'s `mode` property

```ts
<wm-recipe-preview
  .mode=${this._recipePreviewMode}
  .recipe=${recipe}
></wm-recipe-preview>
```

#### 5. Add `mode` property to `RecipePreview`

#### 6. Add conditional CSS class using `classMap`

#### 7. Hide ingredients in a `<details>` element when in compact mode

```ts
<details>
  <summary>Ingredients</summary>${ingredientsTpl}
</details>
```

#### 8. Add a CSS part for the name

Add `part="name"` to the name heading:

```ts
<h2 class="name" part="name">
  ${this.recipe.name}
</h2>
```

#### 9. Style the recipe name using CSS parts

Add this to the `RecipeSearch` styles:

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
- [CSS Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::part)
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

**HTML Details/Summary:**

```html
<details>
  <summary>Ingredients</summary>
  <ul>
    <li>Ingredient 1</li>
    <li>Ingredient 2</li>
  </ul>
</details>
```

- Native HTML elements for expandable content
- `<details>` is the container, `<summary>` is the clickable header
- No JavaScript needed for basic expand/collapse
