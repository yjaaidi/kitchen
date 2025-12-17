---
sidebar_label: 303. Slots
---

# Slots

## Setup

```sh
pnpm cook start 303-slots
pnpm start
```

## 🎯 Goal: Use slots to allow parent components to inject custom content

Your goal is to add a slot to the `RecipePreview` component that allows the parent to inject custom action buttons (like "Add to meal planner"). This demonstrates content projection - a powerful pattern for building flexible, reusable components.

### 📝 Steps

#### 1. Add the slot element

Add a named slot inside the `.content` div, after the ingredients:

```html
<slot class="actions" name="actions"></slot>
```

#### 2. Update RecipeSearch template

In `recipe-search.ts`, add a button inside the `<wm-recipe-preview>` element:

```html
<wm-recipe-preview .mode="${this._recipePreviewMode}" .recipe="${recipe}">
  <button slot="actions">ADD</button>
</wm-recipe-preview>
```

**Key points:**

- The button is now inside the component tag, not self-closing
- `slot="actions"` tells the browser which slot to project into

#### 3. Add the click handler

Adding inline callbacks (e.g. `@click=${() => this._addToMealPlanner(recipe)}`) is not recommended as it can lead to performance issues. It will remove and re-register the callback on every render.

A common pattern in Lit is to use a data attribute to store the recipe id and then use a method to handle the click event.

```html
<button data-user-name="${user.name}" @click="${this._sayHi}">ADD</button>
```

```ts
private _sayHi(event: MouseEvent) {
  const userName = (event.target as HTMLButtonElement).dataset.userName;
  alert(`Hello ${userName}!`);
}
```

## 📖 Appendices

- [Slots (Lit)](https://lit.dev/docs/components/shadow-dom/#slots)
- [Named Slots (Lit)](https://lit.dev/docs/components/shadow-dom/#using-named-slots)
- [HTML slot element (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)
- [Data attributes (MDN)](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes)

### Key Concepts

**Named Slots:**

- Use `name` attribute to create multiple slots
- Parent specifies which slot to target with `slot` attribute

```html
<!-- Child component template -->
<div>
  <slot name="header"></slot>
  <slot></slot>
  <!-- default slot -->
  <slot name="footer"></slot>
</div>

<!-- Parent usage -->
<my-component>
  <h1 slot="header">Title</h1>
  <p>Default content</p>
  <button slot="footer">Close</button>
</my-component>
```

**Data Attributes:**

- Custom attributes prefixed with `data-`
- Accessed via `element.dataset` in JavaScript
- Useful for storing metadata on elements

```html
<button data-recipe-id="123" data-action="add">Add</button>
```

```ts
const button = element as HTMLButtonElement;
const recipeId = button.dataset.recipeId; // "123"
const action = button.dataset.action; // "add"
```
