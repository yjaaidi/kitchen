import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './color-scheme-toggle';
import { Recipe } from './recipe';
import './recipe-filter';
import { RecipeFilterCriteriaChange } from './recipe-filter';
import { RecipeFilterCriteria } from './recipe-filter-criteria';
import './recipe-preview';
import { RECIPE_PREVIEW_MODES, RecipePreviewMode } from './recipe-preview';
import { recipeRepository } from './recipe-repository';
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

  @state()
  private _recipes: Recipe[] = [];

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
        ${this._recipes.map(
          (recipe) =>
            html`<wm-recipe-preview
              .mode=${this._recipePreviewMode}
              .recipe=${recipe}
            ></wm-recipe-preview>`
        )}
      </ul>`;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this._fetchRecipes();
  }

  protected override willUpdate(
    changedProperties: PropertyValues<{
      _criteria?: RecipeFilterCriteria;
    }>
  ): void {
    if (changedProperties.has('_criteria')) {
      this._fetchRecipes();
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

  private async _fetchRecipes() {
    this._recipes = await recipeRepository.searchRecipes(this._criteria ?? {});
  }
}
