# Recipe Search App

A recipe search application built with Lit, inspired by the Angular testing workshop recipe search app.

## Features

- 🔍 Search recipes by keywords
- 📊 Filter by maximum ingredient count
- 📝 Filter by maximum step count
- 🎨 Beautiful, responsive card-based UI
- ⚡ Fast and lightweight using Lit web components

## Architecture

The app is structured using modern Lit patterns:

### Components

- **app-root**: Main application container
- **recipe-search**: Main search component that orchestrates the search functionality
- **recipe-filter**: Search filter form with keyword and numeric filters
- **recipe-catalog**: Responsive grid layout for recipe cards
- **recipe-preview**: Individual recipe card display
- **recipe-card**: Reusable card component with image and content slot

### Services

- **RecipeRepository**: Handles API calls to the Marmicode Recipe API

### Types

- Recipe, Ingredient, Quantity, RecipeFilterCriteria interfaces

## Data Flow

1. User enters filter criteria in the `recipe-filter` component
2. Filter changes emit a custom event with the criteria
3. `recipe-search` listens to filter changes and updates its state
4. `@lit/task` automatically re-runs the search when filter state changes
5. Results are displayed in a `recipe-catalog` as `recipe-preview` cards

## Running the App

```bash
# Install dependencies (if not already done)
pnpm install

# Start the development server
nx serve demo
```

The app will be available at `http://localhost:4200`

## API

The app uses the Marmicode Recipe API:

- Base URL: `https://recipe-api.marmicode.io`
- Endpoint: `/recipes`
- Supports keyword search and ingredient filtering
