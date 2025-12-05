import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './components/recipe-search';

@customElement('app-root')
class AppRoot extends LitElement {
  static override styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: #fafafa;
    }

    h1 {
      text-align: center;
      color: #333;
      padding: 20px 0;
      margin: 0;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `;

  override render() {
    return html`
      <h1>🍳 Recipe Search</h1>
      <recipe-search></recipe-search>
    `;
  }
}

// Mount the app
const root = document.createElement('app-root');
document.body.appendChild(root);
