import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './color-scheme-toggle';
import { createRecipe, Recipe } from './recipe';
import './recipe-filter';
import {
  RecipeFilterCriteria,
  RecipeFilterCriteriaChange,
} from './recipe-filter';
import './recipe-preview';
import { RECIPE_PREVIEW_MODES, RecipePreviewMode } from './recipe-preview';
import './selector';
import { SelectorChange } from './selector';

@customElement('wm-recipe-search')
export class RecipeSearch extends LitElement {
  static override styles = css`
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        135deg,
        var(--primary-color) 0%,
        var(--secondary-color) 100%
      );
      height: 80px;
      width: 100%;
    }

    .title {
      color: white;
      margin: 0;
    }

    .color-scheme-toggle {
      position: absolute;
      right: 1rem;
    }

    .recipe-list {
      padding: 0;
      margin: 0;
    }

    wm-recipe-preview::part(name) {
      color: light-dark(var(--secondary-color), white);
      font-family: Cursive;
    }
  `;

  @state()
  private _criteria?: RecipeFilterCriteria;
  private _recipes: Recipe[] = [
    createRecipe({
      id: 'rec_burger',
      description: 'A burger with a lot of cheese',
      name: 'Burger',
      pictureUri:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ingredients: [
        {
          name: 'Steak',
          quantity: { amount: 150, unit: 'g' },
        },
        {
          name: 'Cheese',
          quantity: { amount: 50, unit: 'g' },
        },
        {
          name: 'Bread',
          quantity: { amount: 30, unit: 'g' },
        },
        {
          name: 'Tomato',
          quantity: { amount: 30, unit: 'g' },
        },
        {
          name: 'Lettuce',
          quantity: { amount: 30, unit: 'g' },
        },
      ],
      steps: ['Step 1: Cook the steak', 'Step 2: Add all the other stuff'],
    }),
    createRecipe({
      id: 'rec_pizza',
      description: 'A pizza with a lot of cheese',
      name: 'Pizza',
      pictureUri:
        'https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ingredients: [],
      steps: [],
    }),
  ];

  @state()
  private _filteredRecipes: Recipe[] = this._recipes;

  @state()
  private _recipePreviewMode: RecipePreviewMode = 'detailed';

  protected override render() {
    return html`<header class="toolbar">
        <h1 class="title">Recipe Search</h1>
        <wm-color-scheme-toggle
          class="color-scheme-toggle"
        ></wm-color-scheme-toggle>
      </header>

      <wm-recipe-filter
        .criteria=${this._criteria}
        @criteria-change=${this._handleCriteriaChange}
      ></wm-recipe-filter>

      <wm-selector
        .options=${RECIPE_PREVIEW_MODES}
        .value=${this._recipePreviewMode}
        @value-change=${this._handleRecipePreviewModeChange}
      ></wm-selector>

      <ul class="recipe-list">
        ${this._filteredRecipes.map(
          (recipe) =>
            html`<wm-recipe-preview
              .mode=${this._recipePreviewMode}
              .recipe=${recipe}
            ></wm-recipe-preview>`
        )}
      </ul>`;
  }

  protected override willUpdate(
    changedProperties: PropertyValues<{
      _criteria?: RecipeFilterCriteria;
    }>
  ): void {
    if (changedProperties.has('_criteria')) {
      this._updatedFilteredRecipes();
    }

    super.willUpdate(changedProperties);
  }

  private _handleCriteriaChange(event: RecipeFilterCriteriaChange) {
    this._criteria = event.criteria;
  }

  private _handleRecipePreviewModeChange(
    event: SelectorChange<RecipePreviewMode>
  ) {
    this._recipePreviewMode = event.value;
  }

  private _updatedFilteredRecipes() {
    const { keywords, maxIngredients, maxSteps } = this._criteria ?? {};
    let filteredRecipes = this._recipes;

    if (keywords) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(keywords.toLowerCase())
      );
    }

    if (maxIngredients) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.ingredients.length <= maxIngredients
      );
    }

    if (maxSteps) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.steps.length <= maxSteps
      );
    }

    this._filteredRecipes = filteredRecipes;
  }
}
