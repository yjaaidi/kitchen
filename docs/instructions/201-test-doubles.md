---
sidebar_label: 201. Test Doubles
---

# Test Doubles

## Setup

```sh
pnpm cook start 201-test-doubles
```

`RecipeSearch` tests are passing, but they hit the **real HTTP API** on every run — slow, flaky, and non-deterministic (the API may return extra recipes at any time).

In this exercise you will **not write new tests**. You will swap the real `RecipeRepository` for a **fake** so the same tests run fast and predictably, with no network.

## 🎯 Goal: Replace the real repository with a fake in `setUp`

**Wire up the fake** in `setUp` so all three existing tests keep passing — without any HTTP call.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

The tests should already be green (they use the real API). After your changes they should stay green — but offline.

#### 2. Go to `src/app/recipe/recipe-search.wide.spec.tsx`.

#### 3. Override the repository singleton **before** `render`.

Use `singletonTestingUtils.override` to replace `recipeRepositorySingleton` with a `RecipeRepositoryFake` instance (See [Overriding a singleton](#-overriding-a-singleton)).

:::warning

Call `override` **before** `render`. The singleton must not be initialized yet — otherwise the override throws.

:::

#### 4. Configure the fake with deterministic recipes.

Use `recipeMother` to build a **Burger** and a **Salad**, then pass them to `fake.configure({ recipes: [...] })` (See [Seeding data with `recipeMother`](#-seeding-data-with-recipemother)).

#### 5. Reset the singleton in `onTestFinished`.

Add `singletonTestingUtils.reset()` alongside the existing `resetStore` call so the next test gets a clean singleton (See [Cleaning up after each test](#-cleaning-up-after-each-test)).

## 📖 Appendices

### 🎁 Overriding a singleton

The app exposes repositories through singletons (`defineSingleton`). In tests, `singletonTestingUtils.override` swaps the factory **before** the singleton is first accessed:

```ts
const cartSingleton = defineSingleton(() => new Cart());

singletonTestingUtils.override(cartSingleton, () => new CartFake());
```

### 🎁 Seeding data with `recipeMother`

`recipeMother` builds `Recipe` objects for tests without hand-writing every field:

```ts
recipeMother.withBasicInfo('Burger').build();
recipeMother.withBasicInfo('Salad').build();
```

### 🎁 Cleaning up after each test

`onTestFinished` runs after each test — use it to undo global side effects:

```ts
onTestFinished(() => singletonTestingUtils.reset());
```

`singletonTestingUtils.reset()` restores every overridden singleton to its original factory.
