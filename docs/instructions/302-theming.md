---
sidebar_label: 302. Theming with CSS Custom Properties
---

# Theming with CSS Custom Properties

## Setup

```sh
pnpm cook start 302-theming
pnpm start
```

## 🎯 Goal: Implement theming with CSS custom properties and `light-dark()` function

Your goal is to replace hardcoded colors with CSS custom properties (CSS variables) and use the modern `light-dark()` CSS function to automatically adapt colors based on the color scheme.

### 📝 Steps

#### 1. Update `src/styles.css`

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

#### 2. Replace hardcoded colors with CSS variables and `light-dark()` function

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
