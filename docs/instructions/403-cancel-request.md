---
sidebar_label: 403. Cancel Requests
---

# Cancel Requests

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 403-cancel-request
```

## 🎯 Goal: Cancel in-flight requests to prevent race conditions

When users type quickly in the search box, multiple requests can be triggered. Your goal is to cancel previous requests when a new one starts, ensuring only the latest request's results are displayed. This prevents race conditions where old results arrive after new ones.

### 📝 Steps

#### Part 1: Update RecipeRepository

##### 1. Add signal parameter

In `recipe-repository.ts`, add an optional `signal` parameter:

```ts
async searchRecipes(
  filterCriteria: RecipeFilterCriteria = {},
  { signal }: { signal?: AbortSignal } = {}
): Promise<Recipe[]> {
```

**Key points:**

- Uses object destructuring for the second parameter
- Default value `{}` makes it optional
- `signal` is typed as optional `AbortSignal`

##### 2. Pass signal to fetch

Pass the signal to the fetch call:

```ts
const response = await fetch(url, { signal });
```

#### Part 2: Update RecipeSearch Component

##### 1. Add AbortController property

Add a property to track the current request's abort controller:

```ts
private _abortController?: AbortController;
```

**Why not @state()?**

- Internal implementation detail
- Doesn't affect rendering
- No need to trigger re-renders when it changes

##### 2. Update \_fetchRecipes method

Implement request cancellation logic:

```ts
private async _fetchRecipes() {
  this._abortController?.abort();
  this._abortController = new AbortController();

  try {
    this._recipes = await recipeRepository.searchRecipes(this._criteria, {
      signal: this._abortController.signal,
    });
    this._error = undefined;
  } catch (error) {
    this._recipes = [];
    this._error = error;
  } finally {
    this._abortController = undefined;
  }
}
```

**Important steps:**

1. Abort any existing request
2. Create a new AbortController
3. Pass its signal to the repository
4. Clear the controller in `finally` block

## 📖 Appendices

### MDN Documentation

- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
- [Fetch with AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#canceling_a_request)

### Key Concepts

**Race Conditions:**

- Multiple async operations compete
- Results arrive in unpredictable order
- Can display stale data
- Common with rapid user input

**Example Problem:**

```
User types "p"       → Request A starts
User types "pi"      → Request B starts
Request B completes  → Shows "pizza" results
Request A completes  → Shows "pasta" results (wrong!)
```

**Solution with AbortController:**

```
User types "p"       → Request A starts
User types "pi"      → Request A canceled, Request B starts
Request B completes  → Shows "pizza" results ✓
```

**AbortController API:**

```ts
// Create controller
const controller = new AbortController();

// Get the signal
const signal = controller.signal;

// Pass to fetch
fetch(url, { signal });

// Cancel the request
controller.abort();

// Check if aborted
if (signal.aborted) {
  console.log('Request was canceled');
}
```

**AbortSignal:**

- Associated with an AbortController
- Passed to async operations
- Operations monitor the signal
- When aborted, operations throw `AbortError`

**Error Handling with Abort:**

```ts
try {
  const response = await fetch(url, { signal });
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was canceled');
    // Don't show error to user
  } else {
    // Handle real errors
    console.error('Request failed:', error);
  }
}
```

**Optional Chaining with abort():**

```ts
// Safe - won't error if undefined
this._abortController?.abort();

// Equivalent to:
if (this._abortController) {
  this._abortController.abort();
}
```

**Why cleanup in finally:**

- Always runs, even if error occurs
- Prevents memory leaks
- Ensures clean state for next request
- Works with both success and failure

**Common Patterns:**

**Pattern 1: Latest Request Wins (our implementation)**

```ts
private async fetchData() {
  this._controller?.abort();
  this._controller = new AbortController();

  const data = await api.fetch({ signal: this._controller.signal });
  return data;
}
```

**Pattern 2: Debounce + Cancel**

```ts
private _debounceTimer?: number;

private scheduleSearch() {
  clearTimeout(this._debounceTimer);
  this._controller?.abort();

  this._debounceTimer = setTimeout(() => {
    this.search();
  }, 300);
}
```

**Pattern 3: Cleanup on Disconnect**

```ts
override disconnectedCallback() {
  super.disconnectedCallback();
  this._controller?.abort(); // Cancel in-flight requests
}
```

**Multiple Signals:**

```ts
// Combine multiple abort signals
const timeout = AbortSignal.timeout(5000); // 5 second timeout
const userAbort = this._controller.signal;

const response = await fetch(url, {
  signal: AbortSignal.any([timeout, userAbort]),
});
```

**When to Use AbortController:**

- Search/filter inputs (frequent changes)
- Autocomplete/suggestions
- Tab switching (cancel when tab changes)
- Component unmounting (cleanup)
- Pagination (cancel when page changes)
- Any scenario with multiple sequential requests

**Performance Benefits:**

- Reduces unnecessary network traffic
- Saves server resources
- Prevents outdated UI updates
- Improves perceived performance

**Browser Support:**

- Modern browsers (2022+)
- Node.js 15+
- Can polyfill for older browsers

**Testing Abort Behavior:**

```ts
// Simulate slow request for testing
async function fetchWithDelay(url: string, signal?: AbortSignal) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check if aborted
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  return fetch(url, { signal });
}
```

**Common Mistakes:**

1. Not clearing controller in finally
2. Reusing the same AbortController (create new one each time)
3. Not handling AbortError specifically
4. Forgetting optional chaining when calling abort()

**Best Practice: Request Manager**

```ts
class RequestManager {
  private _controller?: AbortController;

  async execute<T>(request: (signal: AbortSignal) => Promise<T>): Promise<T> {
    this._controller?.abort();
    this._controller = new AbortController();

    try {
      return await request(this._controller.signal);
    } finally {
      this._controller = undefined;
    }
  }
}
```
