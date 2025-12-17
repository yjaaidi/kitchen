import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('wm-meal-plan')
export class MealPlan extends LitElement {
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
    }

    .overlay.open {
      opacity: 1;
      pointer-events: auto;
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
    }

    .drawer.open {
      transform: translateX(0);
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
    }

    .close-button:hover {
      opacity: 0.7;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .empty-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-color-secondary);
      text-align: center;
      padding: 2rem;
    }

    .empty-message-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-message-text {
      font-size: 1.1rem;
    }
  `;

  @property({ type: Boolean })
  open = false;

  protected override render() {
    return html`
      <div
        class=${classMap({ overlay: true, open: this.open })}
        @click=${this._handleClose}
      ></div>
      <div class=${classMap({ drawer: true, open: this.open })}>
        <header class="header">
          <h2 class="title">Meal Plan</h2>
          <button class="close-button" @click=${this._handleClose}>×</button>
        </header>
        <div class="content">
          <div class="empty-message">
            <div class="empty-message-icon">🍽️</div>
            <div class="empty-message-text">
              Your meal plan is empty.<br />
              Add recipes to get started!
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _handleClose() {
    this.open = false;
    this.dispatchEvent(new MealPlanCloseEvent());
  }
}

export class MealPlanCloseEvent extends Event {
  constructor() {
    super('close');
  }
}
