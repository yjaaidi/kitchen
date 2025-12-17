import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('wm-meal-plan')
export class MealPlan extends LitElement {
  static override styles = css`
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

  protected override render() {
    return html`
      <div class="empty-message">
        <div class="empty-message-icon">🍽️</div>
        <div class="empty-message-text">
          Your meal plan is empty.<br />
          Add recipes to get started!
        </div>
      </div>
    `;
  }
}
