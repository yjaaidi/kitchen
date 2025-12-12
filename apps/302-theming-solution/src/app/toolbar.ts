import { LitElhtml, ement, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('wm-toolbar')
export class Toolbar extends LitElement {
  protected override render() {
    return html`<header class="toolbar">
      <header class="toolbar">
        <h1 class="title">Recipe Search</h1>
      </header>
      <wm-selector .options=${['☀️', '🌙']}></wm-selector>
    </header>`;
  }
}
