---
sidebar_label: 404. Task Controller
---

# Task Controller

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 404-task
```

## 🎯 Goal: Simplify async operations with Lit's Task controller

The current implementation manually manages loading states, errors, and request cancellation. Your goal is to replace this with Lit's `Task` controller, which automatically handles all these concerns in a cleaner, more declarative way.

### 📝 Steps

#### 1. Update imports

In `recipe-search.ts`:

**Add Task import:**

```ts
import { Task } from '@lit/task';
```

**Remove unnecessary imports:**

- Remove `PropertyValues` from lit import
- Remove `when` from directives import
- Remove `Recipe` import (no longer needed directly)

#### 2. Remove manual state management

Delete these properties:

```ts
@state() private _error?: unknown;
@state() private _recipes: Recipe[] = [];
private _abortController?: AbortController;
```

#### 3. Create a Task

Add a Task property to handle recipe fetching:

```ts
private _task = new Task(this, {
  args: () => [this._criteria],
  task: ([criteria], { signal }) =>
    recipeRepository.searchRecipes(criteria, { signal }),
});
```

**Key points:**

- `args` function returns an array of dependencies
- Task re-runs when any dependency changes
- `task` function receives args and options (including signal)
- Signal is automatically managed for request cancellation

#### 4. Remove lifecycle methods

Delete these methods:

- `connectedCallback()`
- `willUpdate()`

The Task automatically runs when args change!

#### 5. Update render method

Replace the manual conditional rendering with `task.render()`:

```ts
${this._task.render({
  pending: () => html`<div class="loading">Loading...</div>`,
  complete: (recipes) => html`<ul class="recipe-list">
    ${recipes.map(
      (recipe) =>
        html`<wm-recipe-preview
          .mode=${this._recipePreviewMode}
          .recipe=${recipe}
        >
          <button
            slot="actions"
            data-recipe-id=${recipe.id}
            @click=${this._handleAddToMealPlanner}
          >
            ADD
          </button>
        </wm-recipe-preview>`
    )}
  </ul>`,
  error: () => html`<div class="error" role="alert">
    <img src="https://marmicode.io/assets/error.gif" alt="Error" />
    <p>Oups, something went wrong.</p>
    <button @click=${this._fetchRecipes}>RETRY</button>
  </div>`,
})}
```

**Key points:**

- `pending()` renders while task is running
- `complete(value)` receives the resolved value
- `error(error)` receives any errors (though we don't use it here)
- Task automatically shows the right state

#### 6. Add loading styles

Add styling for the loading state:

```css
.loading,
.error {
  text-align: center;
  color: var(--text-color);
}
```

#### 7. Simplify \_fetchRecipes method

Replace the entire method with:

```ts
private async _fetchRecipes() {
  await this._task.run();
}
```

Task automatically handles:

- Canceling previous requests
- Managing loading state
- Catching errors
- Updating the UI

## 📖 Appendices

### Lit Documentation

- [Task Controller](https://lit.dev/docs/data/task/)
- [Reactive Controllers](https://lit.dev/docs/composition/controllers/)

### Key Concepts

**Task Benefits:**

- Automatic loading/error state management
- Built-in request cancellation
- Automatic re-running on dependency changes
- Cleaner, more declarative code
- Less boilerplate

**Task Lifecycle:**

1. Component initializes
2. Args function runs
3. If args changed, task runs
4. Task sets state to "pending"
5. Task function executes
6. On success: state = "complete", stores value
7. On error: state = "error", stores error
8. Component renders appropriate state

**Args Function:**

```ts
args: () => [this._criteria];
```

- Returns array of values to track
- Task re-runs when any value changes
- Uses `Object.is()` for comparison
- Can return empty array for manual control

**Task Function:**

```ts
task: ([criteria], { signal }) => {
  return fetch(url, { signal });
};
```

- Receives destructured args
- Receives options object with `signal`
- Return a Promise
- Use signal for cancellation

**Task States:**

- `INITIAL`: Not yet run
- `PENDING`: Currently running
- `COMPLETE`: Successfully completed
- `ERROR`: Failed with error

**Render Callbacks:**
All callbacks are optional:

```ts
task.render({
  initial: () => html`...`, // Before first run
  pending: () => html`...`, // While running
  complete: (value) => html`...`, // Success
  error: (error) => html`...`, // Error
});
```

**Manual Task Control:**

```ts
// Run the task
await this._task.run();

// Run with specific args
await this._task.run(['new-value']);

// Check task status
if (this._task.status === TaskStatus.COMPLETE) {
  const value = this._task.value;
}

// Get error
if (this._task.status === TaskStatus.ERROR) {
  const error = this._task.error;
}
```

**Advanced: Task Configuration:**

```ts
private _task = new Task(this, {
  args: () => [this._userId],
  task: async ([userId], { signal }) => {
    const user = await fetchUser(userId, signal);
    const posts = await fetchPosts(userId, signal);
    return { user, posts };
  },
  autoRun: true,          // Default: true
  onComplete: (value) => {
    console.log('Task completed:', value);
  },
  onError: (error) => {
    console.error('Task failed:', error);
  },
});
```

**Multiple Tasks:**

```ts
private _userTask = new Task(this, {
  args: () => [this._userId],
  task: ([id], { signal }) => fetchUser(id, signal),
});

private _postsTask = new Task(this, {
  args: () => [this._userId],
  task: ([id], { signal }) => fetchPosts(id, signal),
});
```

**Dependent Tasks:**

```ts
private _userTask = new Task(this, {
  args: () => [this._userId],
  task: ([id], { signal }) => fetchUser(id, signal),
});

private _postsTask = new Task(this, {
  args: () => [this._userTask.value?.id],
  task: ([userId], { signal }) => {
    if (!userId) return [];
    return fetchPosts(userId, signal);
  },
});
```

**Task vs Manual State Management:**

**Manual:**

```ts
@state() private _loading = false;
@state() private _error?: Error;
@state() private _data?: Data;

async fetch() {
  this._loading = true;
  this._error = undefined;
  try {
    this._data = await api.fetch();
  } catch (error) {
    this._error = error;
  } finally {
    this._loading = false;
  }
}
```

**With Task:**

```ts
private _task = new Task(this, {
  args: () => [this._filter],
  task: ([filter], { signal }) =>
    api.fetch(filter, signal),
});
```

**When to Use Task:**

- Fetching data from APIs
- Async operations tied to reactive properties
- Need automatic request cancellation
- Want loading/error states handled automatically

**When NOT to Use Task:**

- One-off operations (button clicks)
- Operations not tied to component state
- Complex state machines
- Need fine-grained control over timing

**Testing with Task:**

```ts
// Wait for task to complete
await component._task.taskComplete;

// Check status
expect(component._task.status).toBe(TaskStatus.COMPLETE);

// Check value
expect(component._task.value).toEqual(expectedData);
```

**Common Patterns:**

**Pagination:**

```ts
private _task = new Task(this, {
  args: () => [this._page, this._pageSize],
  task: ([page, size], { signal }) =>
    api.fetch({ page, size, signal }),
});
```

**Search with Debounce:**

```ts
private _debouncedSearch = debounce((query: string) => {
  this._searchQuery = query;
}, 300);

private _task = new Task(this, {
  args: () => [this._searchQuery],
  task: ([query], { signal }) =>
    api.search(query, signal),
});
```

**Retry Logic:**

```ts
private async _retry() {
  await this._task.run();
}

// In template
${this._task.render({
  error: () => html`
    <div>Error occurred</div>
    <button @click=${this._retry}>Retry</button>
  `
})}
```
