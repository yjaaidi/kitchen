---
sidebar_label: 401. Fake Timers
---

# Fake Timers

## Setup

```sh
pnpm cook start 401-fake-timers
```

`RecipeFilterForm` notifies the parent through `onFilterChange`. To avoid firing a search on every keystroke, that callback should be **debounced** (200 ms). Waiting for real time in tests is slow and brittle — you will control the clock with **Vitest fake timers** instead.

## 🎯 Goal #1: `onFilterChange` is not called before the debounce delay

Prove that typing in the form does **not** notify the parent until 200 ms have passed.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-filter-form.browser.spec.tsx`.

#### 3. Replace `it.todo` with `it` for **does not call onFilterChange before debounce delay**.

#### 4. Take control of time for this test (See [Enabling fake timers](#-enabling-fake-timers)).

#### 5. Prevent the debounce from firing while you interact with the form (See [Manual timer mode](#-manual-timer-mode)).

#### 6. Type in **Keywords**.

#### 7. Advance the fake clock — but not far enough for the 200 ms debounce to elapse (See [Advancing time](#-advancing-time)).

#### 8. Assert `onFilterChange` was not called.

## 🎯 Goal #2: `onFilterChange` is called after the debounce delay

Prove that the parent callback fires **once** shortly after the debounce window.

### 📝 Steps

#### 1. Run tests in watch mode.

```sh
pnpm test
```

#### 2. Go to `src/app/recipe/recipe-filter-form.browser.spec.tsx`.

#### 3. Replace `it.todo` with `it` for **calls onFilterChange after debounce delay**.

#### 4. Take control of time for this test (See [Enabling fake timers](#-enabling-fake-timers)).

#### 5. Type in **Keywords**.

#### 6. Advance the fake clock past the debounce window (See [Advancing time](#-advancing-time)).

#### 7. Assert `onFilterChange` was called exactly once with the expected filter.

## 📖 Appendices

### 🎁 Enabling fake timers

Call `vi.useFakeTimers()` before the code under test schedules timers. Restore real timers after each test so later suites are not affected:

```ts
vi.useFakeTimers();
onTestFinished(() => {
  vi.useRealTimers();
});
```

### 🎁 Manual timer mode

`vi.setTimerTickMode('manual')` prevents timers from advancing automatically during user interactions (e.g. `fill`). Use it when you need to assert that a callback has **not** fired yet, then advance time yourself.

### 🎁 Advancing time

`await vi.advanceTimersByTimeAsync(ms)` moves the fake clock forward by `ms` milliseconds. Pick values **just below** and **just above** your debounce delay to assert timing boundaries without waiting in real time.
