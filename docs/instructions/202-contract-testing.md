---
sidebar_label: 202. Contract Testing
---

# Contract Testing

## Setup

```sh
pnpm cook start 202-contract-testing
```

To make sure that the fake and the real implementation behave the same way, you will implement a **contract test**: a shared suite of expectations that will run against **every** implementation. In this project, `verifyRecipeRepositoryContract` is already wired up for:

- `RecipeRepositoryFake` in `recipe-repository.fake.spec.ts` (in-memory, fast)
- the real HTTP `RecipeRepository` in `recipe-repository.wide.spec.ts` (slow, hits the network)

You must **implement the contract**.

## 🎯 Goal #1: `searchRecipes()` returns all recipes

When called with no filter, the repository should return recipes — including at least one named **Burger** (present in both the fake seed data and the remote API).

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-repository.contract.ts`.

#### 3. Implement the **returns all recipes** test.

- Create the recipe repository using the `createRecipeRepositoryFake` factory function.
- Call `searchRecipes()` with no arguments.
- Assert the result **contains** a recipe whose `name` is `Burger` (See [Partial object matching](#-partial-object-matching)).

#### 4. Turn on the test by replacing `it.todo` with `it`.

#### 5. Make sure the test passes for both the fake and the real implementation.

## 🎯 Goal #2: `searchRecipes` filters by keywords

Calling `searchRecipes({ keywords: 'burg' })` should return only recipes whose names match that filter — no unrelated recipes in the result.

### 📝 Steps

#### 1. Go to `src/app/recipe/recipe-repository.contract.ts`.

#### 2. Implement the **filters recipes containg "burg" keywords** test.

- Call `searchRecipes({ keywords: 'burg' })`.
- Split results into recipes whose `name` includes `Burger` and recipes that do not.
- Assert there is **at least one** burger recipe, and **no** other recipes.

#### 3. Replace `it.todo` with `it`.

#### 4. Make sure the test passes for both the fake and the real implementation.

## 🎯 Goal #3: No match returns an empty array

### 📝 Steps

#### 1. Go to `src/app/recipe/recipe-repository.contract.ts`.

#### 2. Implement the **returns an empty array when no recipes are found** test.

- Call `searchRecipes` with keywords that cannot match any seeded or API recipe (e.g. `pizza with salmon and pineapple`).
- Assert the result has length `0`.

#### 3. Replace `it.todo` with `it`.

#### 4. Make sure the test passes for both the fake and the real implementation.

## 📖 Appendices

### 🎁 Partial object matching

Use `toContainEqual` with `expect.objectContaining` when you only care about a subset of fields:

```ts
expect(recipes).toContainEqual(expect.objectContaining({ name: 'Burger' }));
```

This avoids brittle full-object equality when recipes carry ids, ingredients, etc.
