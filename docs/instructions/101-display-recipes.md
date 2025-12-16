---
sidebar_label: 101. Display Recipes
---

# Display Recipes

## Prerequisites

🚨 Did you set up `pnpm`?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 101-display-recipes
```

## 🎯 Goal: Display a list of recipes

The `RecipeSearch` component currently shows a simple greeting message. Your goal is to display the list of recipes that are already stored in the `_recipes` property.

### 📝 Steps

#### 1. Update the `render()` method in `src/app/recipe-search.ts`

Replace the greeting message with a recipe list.

#### 2. Create a toolbar header

Add a header with the title "Recipe Search".

**Example structure:**

```html
<header class="toolbar">
  <h1 class="title">Recipe Search</h1>
</header>
```

#### 3. Display the recipes as a list

Use the `map()` method to iterate through `this._recipes` and render each recipe.

**Key points:**

- Display the recipe image using `recipe.pictureUri`
- Show the recipe name
- Show the recipe description
- List all ingredients with their quantities

**Template example for iteration:**

```ts
${this._recipes.map(
  (recipe) => html`
    <li class="recipe">
      <!-- Recipe content here -->
    </li>
  `
)}
```

#### 4. Display ingredients

For each ingredient, display:

- The quantity (amount and unit) if it exists
- The ingredient name

**Conditional rendering example:**

```ts
${ingredient.quantity
  ? html`${ingredient.quantity.amount} ${ingredient.quantity.unit} `
  : null}
${ingredient.name}
```

#### 5. Update the styles

Replace the `.greetings` styles with styles for:

- `.toolbar`: Header bar with gradient background
- `.title`: Title text styling
- `.recipe-list`: List container
- `.recipe`: Individual recipe card
- `.image`: Recipe image
- `.content`: Recipe content container
- `.name`: Recipe name
- `.description`: Recipe description
- `.ingredients`: Ingredients list

**Style tips:**

- Use a gradient background for the toolbar: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Add border-radius for rounded corners: `12px`
- Center content with `text-align: center` or `justify-content: center`
- Use `object-fit: cover` for images to maintain aspect ratio

## 📖 Appendices

### Lit Documentation

- [Templates](https://lit.dev/docs/templates/overview/)
- [Lists](https://lit.dev/docs/templates/lists/)
- [Conditionals](https://lit.dev/docs/templates/conditionals/)
- [Styling](https://lit.dev/docs/components/styles/)

### Key Concepts

**Rendering lists in Lit:**

```ts
${items.map((item) => html`<div>${item.name}</div>`)}
```

**Conditional rendering:**

```ts
${condition ? html`<div>Show this</div>` : null}
```

**Image with alt text:**

```ts
html`<img src=${url} alt="Description" />`;
```
