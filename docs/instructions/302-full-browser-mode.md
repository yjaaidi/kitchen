---
sidebar_label: 302. Full Browser Mode
---

# Full Browser Mode

## Setup

```sh
pnpm cook start 302-full-browser-mode
```

In the previous exercise (**301 - Browser Mode**), tests are running in a real browser, but they are not leveraging the full power of Vitest's browser mode.

In this exercise, you will switch `RecipeSearch` to **full browser mode** and observe if the tests behave differently.

## 🎯 Goal #1: Switch `RecipeSearch` to full browser mode

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-search.browser.spec.tsx`.

#### 3. Update imports.

- Keep `screen` and `within` from `@testing-library/react`.
- Import `render` from `vitest-browser-react`, instead of `@testing-library/react`.
- Import `userEvent` from `vitest/browser`, instead of `@testing-library/user-event`.

#### 5. Run the tests and see what happens.

#### 6. Fix the bug that you caught.

## 📖 Appendices

### 💥 FAQ: An update ... was not wrapped in `act(...)`.

If you see the following error, then you probably forgot to `await` the promise returned by the new `render` call.

```text
An update to RecipeAddButton inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):
```
