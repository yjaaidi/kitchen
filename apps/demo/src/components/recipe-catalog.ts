import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('recipe-catalog')
export class RecipeCatalog extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
      padding: 30px 0;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}
