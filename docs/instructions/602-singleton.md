---
sidebar_label: 602. Singleton
---

# Singleton

## Setup

```sh
pnpm cook start 602-singleton
pnpm start
```

## 🎯 Goal: Replace Lit Context with a testable singleton pattern

Your goal is to refactor from Lit Context to a testable singleton pattern. The `createSingleton` utility makes singletons testable by allowing them to be overridden and reset in tests.

### 📝 Steps

#### 1. Understand the `createSingleton` utility in `src/app/singleton.ts`

The utility provides:

- `get()` - Lazily creates and returns the singleton instance
- `singletonTesting.override()` - Replaces the instance (for testing)
- `singletonTesting.reset()` - Resets to undefined (for test cleanup)

```ts
const mySingleton = createSingleton(() => new MyService());
mySingleton.get(); // Returns the same instance every time
```

#### 2. Update `MealPlanner` in `src/app/meal-planner.ts`

Replace the context with a singleton:

```ts
import { createSingleton } from './singleton';

export class MealPlanner {
  // ... existing implementation
}

export const mealPlannerSingleton = createSingleton(() => new MealPlanner());
```

**Key points:**

- Remove `createContext` and `MEAL_PLANNER_CONTEXT`
- Export a singleton instead of a context

#### 3. Update `RecipeSearch` in `src/app/recipe-search.ts`

Replace `ContextProvider` with the singleton:

```ts
import { mealPlannerSingleton } from './meal-planner';

private _mealPlanner = mealPlannerSingleton.get();
```

**Key points:**

- Remove `ContextProvider` and `@lit/context` imports
- Remove `MEAL_PLANNER_CONTEXT` import

#### 4. Update `MealPlan` in `src/app/meal-plan.ts`

Replace `@consume` with the singleton:

```ts
import { mealPlannerSingleton } from './meal-planner';

private _mealPlanner = mealPlannerSingleton.get();
```

**Key points:**

- Remove `@consume` decorator and `@lit/context` imports
- Remove `MEAL_PLANNER_CONTEXT` import
- The `_mealPlanner` is no longer optional (no `?`)

## 📖 Appendices

### Key Concepts

**createSingleton pattern:**

```ts
export function createSingleton<T>(factory: () => T): Singleton<T> {
  let value: T | undefined;
  return {
    get: () => (value ??= factory()),
    // ... testing utilities
  };
}
```

- Lazy initialization - instance created on first `get()` call
- Factory function allows complex initialization
- Same instance returned on subsequent calls

**Testing with singletons:**

```ts
import { singletonTesting } from './singleton';
import { mealPlannerSingleton, MealPlanner } from './meal-planner';

describe('MealPlan', () => {
  afterEach(() => {
    singletonTesting.reset(mealPlannerSingleton);
  });

  it('should use mock meal planner', () => {
    const mockPlanner = new MealPlanner();
    singletonTesting.override(mealPlannerSingleton, mockPlanner);

    // Component will use mockPlanner
  });
});
```

**Context vs Singleton:**

| Context                           | Singleton                    |
| --------------------------------- | ---------------------------- |
| Scoped to component tree          | Global to application        |
| Multiple instances possible       | Single instance              |
| Requires provider/consumer setup  | Simple `get()` call          |
| Better for component-scoped state | Better for app-wide services |
| More boilerplate                  | Less boilerplate             |
| Tree-shakeable per subtree        | Always included if imported  |
