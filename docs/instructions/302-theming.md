---
sidebar_label: 302. Theming with CSS Custom Properties
---

# Theming with CSS Custom Properties

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 302-theming
```

## 🎯 Goal: Implement theming with CSS custom properties and light-dark() function

Your goal is to replace hardcoded colors with CSS custom properties (CSS variables) and use the modern `light-dark()` CSS function to automatically adapt colors based on the color scheme.

### 📝 Steps

#### Part 1: Define CSS Custom Properties

##### 1. Update `src/styles.css`

Add CSS custom properties and apply them to the body:

```css
body {
  margin: 0;

  background-color: var(--background-color);
  transition: background-color 0.3s ease-in-out;

  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background-color: light-dark(#eee, #333);
  --background-color-secondary: light-dark(#f5f5f5, #222);
  --text-color: light-dark(#444, white);
  --text-color-secondary: light-dark(#555, white);
}
```

**Key points:**

- CSS custom properties are defined with `--` prefix
- `light-dark(light-value, dark-value)` automatically picks the right value based on `color-scheme`
- The transition provides smooth color changes when toggling themes

#### Part 2: Use CSS Variables in Components

##### 1. Update RecipeSearch component (`recipe-search.ts`)

Replace hardcoded colors in the toolbar gradient:

```css
.toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
  height: 80px;
  width: 100%;
}
```

Update the recipe name part styling to use `light-dark()`:

```css
wm-recipe-preview::part(name) {
  color: light-dark(var(--secondary-color), white);
  font-family: Cursive;
}
```

##### 2. Update ColorSchemeToggle component (`color-scheme-toggle.ts`)

Replace the hardcoded background color with a CSS variable:

```css
.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  line-height: 30px;

  background: var(--background-color);
  border-radius: 50%;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;

  &.dark {
    transform: translateX(28px);
  }
}
```

**Important:** Add `background-color` to the transition (in addition to `transform`).

##### 3. Move ColorScheme type into color-scheme-toggle.ts

Move the `ColorScheme` type from `color-scheme.ts` into `color-scheme-toggle.ts`:

```ts
export type ColorScheme = 'light' | 'dark';
```

Then delete the `src/app/color-scheme.ts` file.

## 📖 Appendices

### Documentation

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [light-dark() Function (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)
- [color-scheme Property (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)

### Key Concepts

**CSS Custom Properties (CSS Variables):**

- Defined with `--` prefix: `--my-color: red;`
- Used with `var()` function: `color: var(--my-color);`
- Can be scoped to specific elements
- Cascade and inherit like normal CSS properties
- Can be changed dynamically with JavaScript

**Benefits:**

- Single source of truth for colors
- Easy theme switching
- Better maintainability
- Can be changed at runtime

**Defining Variables:**

```css
:root {
  --primary-color: #667eea;
  --spacing: 1rem;
}

body {
  --background-color: white;
}
```

**Using Variables:**

```css
.button {
  background: var(--primary-color);
  padding: var(--spacing);
}

/* With fallback */
.text {
  color: var(--text-color, black);
}
```

**light-dark() Function:**

- Modern CSS function for automatic color adaptation
- Syntax: `light-dark(light-color, dark-color)`
- Automatically picks the right value based on `color-scheme` property
- No JavaScript needed
- Browser support: Modern browsers (2023+)

```css
body {
  color-scheme: light dark; /* Enable light/dark mode */
  background: light-dark(white, black);
  color: light-dark(#333, #eee);
}
```

**color-scheme Property:**

- Tells the browser which color schemes the page supports
- Values: `light`, `dark`, `light dark`, `only light`, `only dark`
- Affects system UI (scrollbars, form controls, etc.)
- Used by `light-dark()` function to determine which value to use
- Can be set via CSS or JavaScript:

```css
/* CSS */
html {
  color-scheme: light dark;
}
```

```js
// JavaScript
document.body.style.colorScheme = 'dark';
```

**CSS Variables in Shadow DOM:**

- CSS variables pierce Shadow DOM boundaries
- Defined outside are accessible inside
- Perfect for theming components
- Components can define their own variables for internal use

**Transitions with CSS Variables:**

- Can animate color changes smoothly
- Apply transition to the property using the variable, not the variable itself

```css
/* Correct */
.element {
  background-color: var(--bg-color);
  transition: background-color 0.3s;
}

/* Won't work */
.element {
  --bg-color: red;
  transition: --bg-color 0.3s;
}
```

**Organizational Pattern:**

- Define global theme variables on `:root` or `body`
- Component-specific variables in component styles
- Use semantic naming: `--primary-color`, not `--blue`
- Consider fallbacks for unsupported browsers

**Advanced: JavaScript Integration:**

```js
// Get variable value
const value = getComputedStyle(document.body).getPropertyValue(
  '--primary-color'
);

// Set variable value
document.body.style.setProperty('--primary-color', '#ff0000');
```
