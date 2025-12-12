import { css, html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

@customElement('wm-recipe-filter')
export class RecipeFilter extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

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

  @query('input[name="keywords"]')
  private _searchInput?: HTMLInputElement;

  @query('input[name="maxIngredients"]')
  private _maxIngredientsInput?: HTMLInputElement;

  @query('input[name="maxSteps"]')
  private _maxStepsInput?: HTMLInputElement;

  protected override render() {
    return html`
      <form
        class="search-form"
        @input=${() => this._emitCriteria()}
        @submit=${(event: SubmitEvent) => {
          event.preventDefault();
          this._emitCriteria();
        }}
      >
        <input name="keywords" placeholder="Search recipes" type="text" />
        <input
          min="0"
          name="maxIngredients"
          placeholder="Max ingredients"
          type="number"
        />
        <input min="0" name="maxSteps" placeholder="Max steps" type="number" />
        <button type="submit">🔍</button>
      </form>
    `;
  }

  private _emitCriteria() {
    const keywords = this._searchInput?.value;
    const maxIngredients = _inputValueAsNumber(this._maxIngredientsInput);
    const maxSteps = _inputValueAsNumber(this._maxStepsInput);
    this.dispatchEvent(
      new RecipeFilterChange(
        createRecipeFilterCriteria({ keywords, maxIngredients, maxSteps })
      )
    );
  }
}

function _inputValueAsNumber(input?: HTMLInputElement) {
  const value = input?.valueAsNumber;
  if (value == null || isNaN(value)) {
    return undefined;
  }
  return value;
}

export class RecipeFilterChange extends Event {
  criteria: RecipeFilterCriteria;
  constructor(criteria: RecipeFilterCriteria) {
    super('recipe-filter-change');
    this.criteria = criteria;
  }
}

export function createRecipeFilterCriteria(
  criteria: RecipeFilterCriteria
): RecipeFilterCriteria {
  return criteria;
}

export interface RecipeFilterCriteria {
  keywords?: string;
  maxIngredients?: number;
  maxSteps?: number;
}
