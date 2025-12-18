import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import {
  createRecipeFilterCriteria,
  RecipeFilterCriteria,
} from './recipe-filter-criteria';

/**
 * @event criteria-change - Emitted when an input's value changes
 * @event criteria-submit - Emitted when the form is submitted
 *
 * @property {RecipeFilterCriteria} criteria - The current filter criteria
 */
@customElement('wm-recipe-filter')
export class RecipeFilter extends LitElement {
  static override styles = css`
    .search-form {
      display: grid;
      grid-template-columns: 1fr 1fr 50px;
      max-width: 600px;
      margin: 1rem auto;
      padding: 0 0.5rem;

      input {
        min-width: 100px;
        border: 1px solid #ccc;
        font-size: 1rem;
        line-height: 1.5rem;
        padding: 0.5rem 1rem;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;

        &[name='keywords'] {
          border-radius: 8px 8px 0 0;
          border-bottom: none;
          grid-column: 1 / -1;
        }

        &[name='maxIngredients'] {
          border-radius: 0 0 0 8px;
          border-right: none;
        }

        &[name='maxSteps'] {
          border-right: none;
        }
      }

      button {
        border: 1px solid #ccc;
        border-radius: 0 0 8px 0;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:hover {
          border-color: #999;
        }
      }
    }
  `;

  @property({ type: Object })
  criteria?: RecipeFilterCriteria;

  @query('input[name="keywords"]')
  private _searchInput?: HTMLInputElement;

  @query('input[name="maxIngredients"]')
  private _maxIngredientsInput?: HTMLInputElement;

  @query('input[name="maxSteps"]')
  private _maxStepsInput?: HTMLInputElement;

  protected override render() {
    const { keywords, maxIngredients, maxSteps } = this.criteria ?? {};
    return html`
      <form
        class="search-form"
        @input=${this._handleInput}
        @submit=${this._handleSubmit}
      >
        <input
          name="keywords"
          placeholder="Search recipes"
          type="text"
          .value=${keywords ?? ''}
        />
        <input
          min="0"
          name="maxIngredients"
          placeholder="Max ingredients"
          type="number"
          .value=${maxIngredients?.toString() ?? ''}
        />
        <input
          min="0"
          name="maxSteps"
          placeholder="Max steps"
          type="number"
          .value=${maxSteps?.toString() ?? ''}
        />
        <button type="submit">🔍</button>
      </form>
    `;
  }

  private _handleInput() {
    this.dispatchEvent(new RecipeFilterCriteriaChange(this._buildCriteria()));
  }

  private _handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.dispatchEvent(new RecipeFilterCriteriaSubmit(this._buildCriteria()));
  }

  private _buildCriteria(): RecipeFilterCriteria {
    const keywords = this._searchInput?.value;
    const maxIngredients = _inputValueAsNumber(this._maxIngredientsInput);
    const maxSteps = _inputValueAsNumber(this._maxStepsInput);
    return createRecipeFilterCriteria({ keywords, maxIngredients, maxSteps });
  }
}

function _inputValueAsNumber(input?: HTMLInputElement) {
  const value = input?.valueAsNumber;
  if (value == null || isNaN(value)) {
    return undefined;
  }
  return value;
}

export class RecipeFilterCriteriaChange extends Event {
  criteria: RecipeFilterCriteria;
  constructor(criteria: RecipeFilterCriteria) {
    super('criteria-change');
    this.criteria = criteria;
  }
}

export class RecipeFilterCriteriaSubmit extends Event {
  criteria: RecipeFilterCriteria;
  constructor(criteria: RecipeFilterCriteria) {
    super('criteria-submit');
    this.criteria = criteria;
  }
}
