import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('recipe-card')
export class RecipeCard extends LitElement {
  @property({ type: String })
  pictureUri?: string;

  static override styles = css`
    :host {
      display: block;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      text-align: left;
      width: 300px;
      background: white;
    }

    .picture {
      object-fit: cover;
      height: 300px;
      width: 100%;
    }

    .content {
      margin: 10px;
    }
  `;

  override render() {
    return html`
      ${this.pictureUri
        ? html`<img class="picture" src="${this.pictureUri}" />`
        : ''}
      <div class="content">
        <slot></slot>
      </div>
    `;
  }
}
