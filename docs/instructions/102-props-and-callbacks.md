---
sidebar_label: 102. Props and Callbacks
---

# Props and Callbacks

## Setup

```sh
pnpm cook start 102-props-and-callbacks
```

:::info ♻️ TDD option

You can choose to:

- go full-on TDD and implement the tests first then checkout the implementation later,
- or checkout the implementation first and then implement the tests.

:::

`RecipeFilterForm` is a **controlled** component: the parent owns the filter via the `filter` prop and is notified of edits through `onFilterChange`. You will test that contract in isolation — no network, no global store.

## 🎯 Goal #1: The form is pre-filled from the `filter` prop

When the parent passes a `filter`, each field should reflect the corresponding value.

**Implement** a test that mounts `RecipeFilterForm` with a `filter` and asserts that **Keywords**, **Max Ingredients**, and **Max Steps** show the right values.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-filter-form.spec.tsx`.

#### 3. Mount the `RecipeFilterForm` component with a `filter` property.

#### 4. Query inputs by their accessible label and assert their values.

Use `screen.getByLabelText(...)` and the `toHaveValue` matcher.

## 🎯 Goal #2: The form calls `onFilterChange` with the new filter when user types

When the user edits a field, the parent callback should receive the new filter.

**Implement** a test that types in **Keywords** and asserts that `onFilterChange` was called with `{ keywords: '…' }`.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-filter-form.spec.tsx`.

#### 3. Spy on the callback using `vi.fn` (See [Spying on callbacks](#-spying-on-callbacks)).

#### 4. Type into the **Keywords** field with `userEvent`.

Clear the field first if needed, then type the new text.

#### 5. Assert the spy was called with the expected filter.

Use [`toHaveBeenLastCalledWith`](#-spying-on-callbacks) so you only care about the latest emission.

## 📖 Appendices

### 🎁 Spying on callbacks

Use Vitest’s `vi.fn()` to create a spy, then assert how it was called:

```ts
const onCountChange = vi.fn<(count: number) => void>();

render(<Counter onCountChange={onCountChange} />);

await userEvent.click(screen.getByRole('button', { name: '+' }));

expect(onCountChange).toHaveBeenLastCalledWith(1);
```

`toHaveBeenLastCalledWith` is handy when the component may call the callback more than once (for example while typing character by character) — you only assert the final payload.
