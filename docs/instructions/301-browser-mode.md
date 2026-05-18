---
sidebar_label: 301. Browser Mode
---

# Browser Mode

## Setup

```sh
pnpm cook start 301-browser-mode
```

`RecipeSearch` and `RecipeFilterForm` already have passing component tests — they just run in an emulated environment (jsdom) today. **Opt them into browser mode** by renaming their spec files. No test code changes.

## 🎯 Goal: Run recipe search and filter tests in the browser

Rename the two component test files so Vitest picks them up for the `browser` project.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Rename `recipe-search.spec.tsx` to `recipe-search.browser.spec.tsx`.

#### 3. Rename `recipe-filter-form.spec.tsx` to `recipe-filter-form.browser.spec.tsx`.

#### 4. Make sure the tests pass.
