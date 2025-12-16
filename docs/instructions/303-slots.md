---
sidebar_label: 303. Slots
---

# Slots

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 303-slots
```

## 🎯 Goal: Use slots to allow parent components to inject custom content

Your goal is to add a slot to the `RecipePreview` component that allows the parent to inject custom action buttons (like "Add to meal planner"). This demonstrates content projection - a powerful pattern for building flexible, reusable components.

### 📝 Steps

#### Part 1: Add a Named Slot to RecipePreview

##### 1. Add slot styling

In `recipe-preview.ts`, add styles for the actions slot:

```css
.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
```

##### 2. Add the slot element

Add a named slot inside the `.content` div, after the ingredients:

```html
<slot class="actions" name="actions"></slot>
```

**Important:** Place it after the ingredients section, still inside the `.content` div.

#### Part 2: Provide Slotted Content from Parent

##### 1. Update RecipeSearch template

In `recipe-search.ts`, add a button inside the `<wm-recipe-preview>` element:

```html
<wm-recipe-preview .mode="${this._recipePreviewMode}" .recipe="${recipe}">
  <button
    slot="actions"
    data-recipe-id="${recipe.id}"
    @click="${this._handleAddToMealPlanner}"
  >
    ADD
  </button>
</wm-recipe-preview>
```

**Key points:**

- The button is now inside the component tag, not self-closing
- `slot="actions"` tells the browser which slot to project into
- `data-recipe-id=${recipe.id}` stores the recipe ID as a data attribute
- The click handler will read this data attribute

##### 2. Add the click handler

Add this method to the `RecipeSearch` class:

```ts
private _handleAddToMealPlanner(event: MouseEvent) {
  const recipeId = (event.target as HTMLButtonElement).dataset.recipeId;
  alert(`Adding recipe ${recipeId} to meal planner`);
}
```

## 📖 Appendices

### Lit Documentation

- [Shadow DOM](https://lit.dev/docs/components/shadow-dom/)
- [Slots](https://lit.dev/docs/components/shadow-dom/#slots)
- [Named Slots](https://lit.dev/docs/components/shadow-dom/#named-slots)

### MDN Documentation

- [Using Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [HTML slot element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)
- [Data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes)

### Key Concepts

**Slots:**

- Allow parent components to inject content into child components
- Part of the Web Components standard (Shadow DOM)
- Enable content projection/transclusion
- Make components more flexible and reusable

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

**Default vs Named Slots:**

- Default slot: `<slot></slot>` (no name attribute)
- Named slot: `<slot name="my-slot"></slot>`
- Content without `slot` attribute goes to default slot
- Content with `slot="my-slot"` goes to that named slot

**Slot Rendering:**

- Slotted content is rendered in the light DOM (parent's DOM)
- But displayed in the shadow DOM (child's DOM) at the slot position
- Slotted content uses parent's styles by default
- Child can style slotted content using `::slotted()` selector

**::slotted() Pseudo-element:**

```css
/* Inside child component styles */
::slotted(button) {
  background: blue;
}

/* Can only style direct children of slot */
::slotted(.my-class) {
  color: red;
}
```

**Limitations:**

- Can only style direct slot children, not descendants
- `::slotted(button span)` won't work
- Use CSS custom properties for deeper styling control

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

**Attribute naming:**

- HTML: `data-recipe-id` (kebab-case)
- JavaScript: `dataset.recipeId` (camelCase)
- Automatically converted between formats

**Benefits of Slots:**

- Flexible component APIs
- Parent controls content and behavior
- Child provides structure and styling
- Enables composition over configuration
- Better than passing everything as properties

**When to Use Slots:**

- Complex content that varies by usage
- HTML structure that needs to be customized
- Buttons, links, or interactive elements
- Rich formatting (bold, italic, etc.)

**When to Use Properties:**

- Simple data (strings, numbers, booleans)
- Data that needs validation
- Data that affects component logic
- Primitive values

**Slot Change Events:**

- Listen to `slotchange` event to detect when slot content changes
- Useful for components that need to react to content changes

```ts
<slot @slotchange=${this._handleSlotChange}></slot>
```

**Checking if Slot Has Content:**

```ts
const slot = this.shadowRoot?.querySelector('slot[name="actions"]');
const hasContent = slot?.assignedNodes().length > 0;
```

**Fallback Content:**

- Content inside `<slot>` tags is shown if nothing is slotted

```html
<slot name="actions">
  <button>Default Action</button>
</slot>
```
