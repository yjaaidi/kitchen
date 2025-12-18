import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

@customElement('wm-drawer')
export class Drawer extends LitElement {
  static override styles = css`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease-in-out;

      &.open {
        opacity: 1;
        pointer-events: auto;
      }
    }

    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 400px;
      max-width: 90vw;
      background-color: var(--background-color);
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
      display: flex;
      flex-direction: column;

      &.open {
        transform: translateX(0);
      }
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid var(--text-color-secondary);
    }

    .title {
      margin: 0;
      color: var(--text-color);
      font-size: 1.5rem;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-color);
      padding: 0.5rem;
      line-height: 1;

      &:hover {
        opacity: 0.7;
      }
    }

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow-y: scroll;
      padding: 1rem;
    }
  `;

  @property({ type: Boolean })
  open = false;

  @property()
  label?: string;

  protected override render() {
    return html`
      <div
        class=${classMap({ overlay: true, open: this.open })}
        @click=${this._handleClose}
      ></div>
      <div class=${classMap({ drawer: true, open: this.open })}>
        <header class="header">
          ${when(this.label, () => html`<h2 class="title">${this.label}</h2>`)}
          <button class="close-button" @click=${this._handleClose}>×</button>
        </header>
        <slot class="content"></slot>
      </div>
    `;
  }

  private _handleClose() {
    this.open = false;
    this.dispatchEvent(new DrawerCloseEvent());
  }
}

export class DrawerCloseEvent extends Event {
  constructor() {
    super('close');
  }
}
