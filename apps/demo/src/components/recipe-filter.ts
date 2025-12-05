import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { RecipeFilterCriteria } from '../types/recipe';

@customElement('recipe-filter')
export class RecipeFilter extends LitElement {
  @state()
  private keywords = '';

  @state()
  private maxIngredientCount = '';

  @state()
  private maxStepCount = '';

  static override styles = css`
    :host {
      display: block;
      text-align: center;
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    form {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      text-align: left;
      min-width: 200px;
    }

    label {
      margin-bottom: 5px;
      color: #666;
      font-size: 0.9em;
    }

    input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1em;
      font-family: inherit;
    }

    input:focus {
      outline: none;
      border-color: #3f51b5;
      box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.1);
    }
  `;

  private _emitFilterChange() {
    const criteria: RecipeFilterCriteria = {
      keywords: this.keywords || undefined,
      maxIngredientCount: this.maxIngredientCount
        ? parseInt(this.maxIngredientCount, 10)
        : undefined,
      maxStepCount: this.maxStepCount
        ? parseInt(this.maxStepCount, 10)
        : undefined,
    };

    this.dispatchEvent(
      new CustomEvent('filter-change', {
        detail: criteria,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleInput(
    e: Event,
    field: 'keywords' | 'maxIngredientCount' | 'maxStepCount'
  ) {
    const input = e.target as HTMLInputElement;
    this[field] = input.value;
    this._emitFilterChange();
  }

  override render() {
    return html`
      <form @submit="${(e: Event) => e.preventDefault()}">
        <div class="form-field">
          <label for="keywords">Keywords</label>
          <input
            id="keywords"
            type="text"
            .value="${this.keywords}"
            @input="${(e: Event) => this._handleInput(e, 'keywords')}"
            placeholder="Search recipes..."
          />
        </div>

        <div class="form-field">
          <label for="maxIngredientCount">Max Ingredients</label>
          <input
            id="maxIngredientCount"
            type="number"
            .value="${this.maxIngredientCount}"
            @input="${(e: Event) => this._handleInput(e, 'maxIngredientCount')}"
            placeholder="e.g. 10"
            min="1"
          />
        </div>

        <div class="form-field">
          <label for="maxStepCount">Max Steps</label>
          <input
            id="maxStepCount"
            type="number"
            .value="${this.maxStepCount}"
            @input="${(e: Event) => this._handleInput(e, 'maxStepCount')}"
            placeholder="e.g. 5"
            min="1"
          />
        </div>
      </form>
    `;
  }
}
