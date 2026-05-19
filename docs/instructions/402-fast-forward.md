---
sidebar_label: 402. Fast Forward
---

# Fast Forward

## Setup

```sh
pnpm cook start 402-fast-forward
```

## 🎯 Goal #1: Fast-forward debounce in `RecipeFilterForm` tests

Move fake-timer setup into `mountRecipeFilterForm` and enable **fast-forward** so behaviour tests flush the 200 ms debounce immediately.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `vitest.config.mts`.

#### 3. Reduce the `TIMEOUT` constant to 100ms.

```ts
const TIMEOUT = 100;
```

#### 4. Go to `src/app/recipe/recipe-filter-form.browser.spec.tsx`.

#### 5. In `mountRecipeFilterForm`, enable fake timers and fast-forward mode before `render` (See [Fast-forward mode](#-fast-forward-mode)).

#### 6. Do not break the debounce tests by switching them to manual mode before acting and asserting.

#### 7. Make sure the tests are passing without timing out.

## 🎯 Goal #2: Fast-forward debounce in `RecipeSearch` tests

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-search.browser.spec.tsx`.

#### 3. At the start of `setUp`, enable fake timers and fast-forward mode before `render` (See [Fast-forward mode](#-fast-forward-mode)).

#### 4. Make sure the tests are passing without timing out.

## 📖 Appendices

### 🎁 Fast-forward mode

```ts
vi.setTimerTickMode('nextTimerAsync');
```

### 🎁 Manual mode during precise timing tests

```ts
vi.setTimerTickMode('manual');
```
