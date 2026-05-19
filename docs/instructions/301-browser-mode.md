---
sidebar_label: 301. Browser Mode
---

# Browser Mode

## Setup

```sh
pnpm cook start 301-browser-mode
```

This repo is already configured for browser mode in `vitest.config.mts`: files matching `*.browser.spec.ts(x)` run in the `browser` project.

## 🎯 Goal #1: Run `RecipeSearch` tests in the browser

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-search.spec.tsx`.

#### 3. Rename the file so it matches the browser project pattern: `recipe-search.browser.spec.tsx`.

#### 4. Confirm all three `RecipeSearch` tests still pass in the **browser** project.

## 🎯 Goal #2: Run `RecipeFilterForm` tests in the browser

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-filter-form.spec.tsx`.

#### 3. Rename the file to `recipe-filter-form.browser.spec.tsx`.

#### 4. Confirm all five `RecipeFilterForm` tests pass in the **browser** project.
