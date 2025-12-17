import { Task } from '@lit/task';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './color-scheme-toggle';
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

    .loading,
    .error {
      text-align: center;
      color: var(--text-color);
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
  private _recipePreviewMode: RecipePreviewMode = 'detailed';

  private _task = new Task(this, {
    args: () => [this._criteria],
    task: ([criteria], { signal }) =>
      recipeRepository.searchRecipes(criteria, { signal }),
  });

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
        @criteria-submit=${this._fetchRecipes}
      ></wm-recipe-filter>

      <wm-selector
        .options=${RECIPE_PREVIEW_MODES}
        .value=${this._recipePreviewMode}
        @value-change=${this._handleRecipePreviewModeChange}
      ></wm-selector>

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
      })} `;
  }

  private _handleAddToMealPlanner(event: MouseEvent) {
    const recipeId = (event.target as HTMLButtonElement).dataset.recipeId;
    alert(`Adding recipe ${recipeId} to meal planner`);
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
    await this._task.run();
  }
}
