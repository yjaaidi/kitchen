---
sidebar_label: 101. Component Testing
---

# Component Testing

## Prerequisites

🚨 Did you set up `pnpm`?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 101-component-testing
```

:::info ♻️ TDD option

You can choose to:

- go full-on TDD and implement the tests first then checkout the implementation later,
- or checkout the implementation first and then implement the tests.

:::

## 🎯 Goal #1: Recipes from the network show up in the catalog

`RecipeSearch` loads recipes through TanStack Query and the real `RecipeRepository` (HTTP). Once data is on screen, recipe names should be visible in the document.

**Implement** a test that asserts that the recipes are displayed when mounting the `RecipeSearch` component.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-search.wide.spec.tsx`.

#### 3. Mount the `RecipeSearch` component and assert that the recipes are displayed (See [Testing Library matchers](#-testing-library-matchers)).

Use the `setUp` function to mount the `RecipeSearch` component, and use the utilities it returns to assert that the recipes are displayed.

:::info

Note that the remote HTTP API returns a Burger and a Salad but might return other additional recipes at any time.

:::

#### 4. Turn on the test by replacing `it.todo` with `it`.

#### 5. [optional] Checkout the implementation if you've opted for TDD option:

```sh
pnpm cook checkout-impl
```

## 🎯 Goal #2: Filtering by keywords narrows visible recipes

Typing in the keywords field should trigger a new search and update the list.

**Implement** a test that types in the keywords field and asserts that only the matching recipe(s) remain visible.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-search.wide.spec.tsx`.

#### 3. Mount the `RecipeSearch` component and type in the keywords field (example: `burg` to filter burgers).

#### 4. Assert that only the matching recipe(s) remain visible.

#### 5. Turn on the test by replacing `it.todo` with `it`.

#### 6. [optional] Checkout the implementation if you've opted for TDD option:

```sh
pnpm cook checkout-impl
```

## 🎯 Goal #3: “ADD” on a given recipe updates meal planner state

Clicking **ADD** on one recipe card should register that recipe in the Zustand meal planner store.

**Implement** a test that clicks **ADD** on a specific recipe and asserts the meal planner state.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-search.wide.spec.tsx`.

#### 3. Click the **ADD** button on a specific recipe.

Note that each recipe has an **ADD** button _(aria role: `button`)_.

You might need to use `within` to scope the query to the recipe card. (See [Tip: scoping with `within`](#-tip-scoping-with-within))

#### 4. Turn on the test by replacing `it.todo` with `it`.

#### 5. [optional] Checkout the implementation if you've opted for TDD option:

```sh
pnpm cook checkout-impl
```

## 📖 Appendices

### 🔗 Testing Library queries

[About queries](https://testing-library.com/docs/queries/about) — choosing the right query and `get` vs `find`.

### 🔗 Testing Library matchers

[About matchers](https://testing-library.com/docs/ecosystem-jest-dom/matchers) — using the right matcher to assert the expected behavior.

### 🎁 Tip: scoping with `within`

When multiple nodes match the same role and name, you can use `within` to query from a **container** element:

```ts
async function findTomatoesInAGroceriesList() {
  const listEl = await screen.findByRole('list');
  const tomatoesEl = await within(listEl).findByRole('listitem', { name: 'Tomatoes' });
  return tomatoesEl;
}
```

### 🎁 Tip: asserting store's state

The Meal Planner store is a Zustand store. You can read the state from the store using `useMealPlannerStore.getState().recipes`.
