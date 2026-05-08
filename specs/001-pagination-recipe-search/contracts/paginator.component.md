# Contract: Paginator Component

**File**: `src/app/shared/paginator.ng.ts`  
**Selector**: `wm-paginator`

## Inputs

| Input | Type | Required | Description |
|---|---|---|---|
| `currentPage` | `number` | yes | 0-indexed current page number |
| `totalPages` | `number` | yes | Total number of pages |
| `isLoading` | `boolean` | no (default: `false`) | When `true`, both navigation buttons are disabled |

## Outputs

| Output | Payload | Description |
|---|---|---|
| `next` | `void` | Emitted when user activates the "Next" button |
| `previous` | `void` | Emitted when user activates the "Previous" button |

## Behaviour Contract

1. **Hidden when not needed**: The component renders nothing (or hides itself) when `totalPages <= 1`.
2. **"Previous" disabled**: when `currentPage === 0` or `isLoading === true`.
3. **"Next" disabled**: when `currentPage === totalPages - 1` or `isLoading === true`.
4. **Label**: displays "Page {currentPage + 1} of {totalPages}".
5. **No internal state**: the component is purely presentational; all state is owned by the parent (`RecipeSearch`).

## Usage Example

```html
<wm-paginator
  [currentPage]="currentPage()"
  [totalPages]="totalPages()"
  [isLoading]="allRecipes.isLoading()"
  (previous)="currentPage.update(p => p - 1)"
  (next)="currentPage.update(p => p + 1)"
/>
```

## Test IDs / Query Handles (for browser tests)

| Element | Role / Text | Purpose |
|---|---|---|
| "Previous" button | `button` with text "Previous" | `page.getByRole('button', { name: 'Previous' })` |
| "Next" button | `button` with text "Next" | `page.getByRole('button', { name: 'Next' })` |
| Page label | any element with text "Page N of M" | `page.getByText(/Page \d+ of \d+/)` |
