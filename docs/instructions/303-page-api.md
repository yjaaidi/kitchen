---
sidebar_label: 303. Page API
---

# Page API

## Setup

```sh
pnpm cook start 303-page-api
```

## 🎯 Goal #1: Migrate `RecipeSearch` tests

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-search.browser.spec.tsx`.

#### 3. Use the `page` API to query the DOM and interact with it. See [Page Locators](#-page-locators).

#### 4. Use `expect.element` to make DOM assertions. See [Expect Element](#-expect-element).

## 🎯 Goal #2: Migrate `RecipeFilterForm` tests

Totally replace Testing Library queries and `userEvent` with **page locators** and locator actions (`.fill()`, `.clear()`).

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-filter-form.browser.spec.tsx`.

#### 3. Use the `page` API to query the DOM and interact with it. See [Page Locators](#-page-locators).

#### 4. Use `expect.element` to make DOM assertions. See [Expect Element](#-expect-element).

## 📖 Appendices

### 🎁 Page locators

`page.getByRole`, `page.getByLabelText`, etc. return **locators**: lazy handles that resolve when you interact or assert. They replace `screen.getBy*` / `screen.findBy*` in browser tests:

```ts
const cityInput = page.getByLabelText('City');
await cityInput.fill('Lyon');
```

### 🎁 `expect.element`

`expect.element(locator)` auto-retries until the assertion passes or times out — similar to `findBy*` in Testing Library, but built into Vitest:

```ts
await expect.element(countryInput).toHaveValue('France');
```

### 🎁 Filtering locators

Narrow a collection locator to a single match with `.filter()`:

```ts
// create a locator that matches the first item that contains a DELETE button.
page
  .getByRole('listitem')
  .filter({ has: page.getByRole('button', { name: 'DELETE' }) })
  .first();
```

`.nth(0)` picks an item when you need a specific index on a collection locator.
