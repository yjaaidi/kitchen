import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Recipe } from '../types/recipe';
import './recipe-card';

@customElement('recipe-preview')
export class RecipePreview extends LitElement {
  @property({ type: Object })
  recipe!: Recipe;

  static override styles = css`
    h2 {
      font-size: 1.2em;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 10px 0;
    }
  `;

  override render() {
    return html`
      <recipe-card .pictureUri="${this.recipe.pictureUri}">
        <h2 data-testid="recipe-name">${this.recipe.name}</h2>
        <slot></slot>
      </recipe-card>
    `;
  }
}
