import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Task } from '@lit/task';
import type { Recipe, RecipeFilterCriteria } from '../types/recipe';
import { recipeRepository } from '../services/recipe-repository';
import './recipe-filter';
import './recipe-catalog';
import './recipe-preview';

@customElement('recipe-search')
export class RecipeSearch extends LitElement {
  @state()
  private filter: RecipeFilterCriteria = {};

  private _searchTask = new Task(this, {
    task: async ([filter]) => {
      return await recipeRepository.search(filter);
    },
    args: () => [this.filter] as [RecipeFilterCriteria],
  });

  static override styles = css`
    :host {
      display: block;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 1.2em;
    }

    .error {
      text-align: center;
      padding: 40px;
      color: #d32f2f;
      font-size: 1.2em;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 1.2em;
    }
  `;

  private _handleFilterChange(e: CustomEvent<RecipeFilterCriteria>) {
    this.filter = e.detail;
  }

  override render() {
    return html`
      <recipe-filter
        @filter-change="${this._handleFilterChange}"
      ></recipe-filter>

      ${this._searchTask.render({
        pending: () => html`<div class="loading">🔍 Searching recipes...</div>`,
        complete: (recipes: Recipe[]) => html`
          <recipe-catalog>
            ${recipes.length === 0
              ? html`<div class="no-results">
                  No recipes found. Try different filters!
                </div>`
              : recipes.map(
                  (recipe) => html`
                    <recipe-preview
                      .recipe="${recipe}"
                      data-testid="recipe-preview"
                    ></recipe-preview>
                  `
                )}
          </recipe-catalog>
        `,
        error: (error: unknown) => html`
          <div class="error">❌ Error loading recipes: ${error instanceof Error ? error.message : 'Unknown error'}</div>
        `,
      })}
    `;
  }
}
