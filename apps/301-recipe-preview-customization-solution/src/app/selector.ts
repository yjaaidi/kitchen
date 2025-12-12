import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @event value-change - Emitted when the selected value changes
 *
 * @property {T[]} options - The options to select from
 * @property {T} value - The selected value
 */
@customElement('wm-selector')
export class Selector<T extends string> extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      justify-content: center;
    }

    button {
      padding: 0.5rem 1rem;

      background: transparent;
      border: 1px solid #ccc;
      border-right: none;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s, border-color 0.2s;

      &:disabled {
        background: linear-gradient(135deg, #667eea 0%, #644ba2 100%);
        border-color: #667eea;
        color: white;
        cursor: initial;
      }

      &:first-child {
        border-radius: 8px 0 0 8px;
      }

      &:last-child {
        border-right: 1px solid #ccc;
        border-radius: 0 8px 8px 0;
      }
    }
  `;

  @property({ type: Array })
  options: T[] = [];

  @property()
  value?: T;

  private _enrichedOptions: Array<{ value: T; onClick: () => void }> = [];

  protected override render() {
    return this._enrichedOptions.map(
      (option) => html`
        <button
          @click=${option.onClick}
          ?disabled=${this.value === option.value}
        >
          ${option.value.toUpperCase()}
        </button>
      `
    );
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('options')) {
      this._enrichedOptions = this.options.map((option) => ({
        value: option,
        onClick: () => this.dispatchEvent(new SelectorChange(option)),
      }));
    }
  }
}

export class SelectorChange<T extends string> extends Event {
  value: T;
  constructor(value: T) {
    super('value-change');
    this.value = value;
  }
}
