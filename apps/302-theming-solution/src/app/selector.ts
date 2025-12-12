import { css, html, LitElement } from 'lit';
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

  protected override render() {
    /* Disable lint rule as performance impact is negligible
     * compare to the effort of preparing a callback list.
     * e.g. attaching/removing callbacks is barely 10x slower than `toUpperCase()`. */

    /* eslint-disable lit/no-template-arrow */
    return this.options.map(
      (option) => html`
        <button
          @click=${() => this.dispatchEvent(new SelectorChange(option))}
          ?disabled=${this.value === option}
        >
          ${option.toUpperCase()}
        </button>
      `
    );
    /* eslint-enable lit/no-template-arrow */
  }
}

export class SelectorChange<T extends string> extends Event {
  value: T;
  constructor(value: T) {
    super('value-change');
    this.value = value;
  }
}
