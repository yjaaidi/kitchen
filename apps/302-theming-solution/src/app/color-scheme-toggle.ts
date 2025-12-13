import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('wm-color-scheme-toggle')
export class ColorSchemeToggle extends LitElement {
  static override styles = css`
    .toggle {
      position: relative;
      width: 60px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .toggle:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .toggle-slider {
      position: absolute;
      top: 0;
      left: 0;
      width: 28px;
      height: 28px;
      line-height: 30px;

      background: var(--background-color);
      border-radius: 50%;
      transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;

      &.dark {
        transform: translateX(28px);
      }
    }
  `;

  @state()
  private _colorScheme: ColorScheme = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches
    ? 'dark'
    : 'light';

  protected override render() {
    const dark = this._colorScheme === 'dark';
    const icon = dark ? '🌙' : '☀️';
    return html`<button class="toggle" @click=${this._toggleColorScheme}>
      <span class=${classMap({ 'toggle-slider': true, dark })}>${icon}</span>
    </button>`;
  }

  protected override willUpdate(
    changedProperties: PropertyValues<{ _colorScheme?: ColorScheme }>
  ): void {
    if (changedProperties.has('_colorScheme')) {
      document.body.style.colorScheme = this._colorScheme;
    }
  }

  private _toggleColorScheme() {
    this._colorScheme = this._colorScheme === 'light' ? 'dark' : 'light';
  }
}

export type ColorScheme = 'light' | 'dark';
