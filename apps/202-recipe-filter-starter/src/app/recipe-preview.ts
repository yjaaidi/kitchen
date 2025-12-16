import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Recipe } from './recipe';

/**
 * @property {Recipe} recipe - The recipe to display
 */
@customElement('wm-recipe-preview')
export class RecipePreview extends LitElement {
  static override styles = css`
    .recipe {
      border: 1px solid #ddd;
      border-radius: 12px;
      color: #444;
      margin: 1rem auto;
      max-width: 400px;
      overflow: hidden;
    }

    .image {
      max-height: 150px;
      object-fit: cover;
      width: 100%;
    }
    .content {
      padding: 1rem;
    }

    .name {
      margin: 0;
      text-align: center;
    }

    .ingredients {
      color: #555;
      font-size: 0.9em;
    }

    .steps {
      color: #555;
      font-size: 0.9em;
    }

    .section-title {
      font-size: 0.9em;
      font-weight: italic;
    }
  `;

  @property()
  recipe?: Recipe;

  protected override render() {
    if (!this.recipe) {
      return;
    }

    return html`
      <li class="recipe">
        <img
          class="image"
          src=${this.recipe.pictureUri}
          alt="Picture of ${this.recipe.name}"
        />
        <div class="content">
          <h2 class="name">${this.recipe.name}</h2>
          <p class="description">${this.recipe.description}</p>
          <ul class="ingredients">
            ${this.recipe.ingredients.map(
              (ingredient) => html`<li>
                ${when(
                  ingredient.quantity,
                  (quantity) => html`<span class="quantity"
                    >${quantity.amount}${quantity.unit}</span
                  >`
                )}
                ${ingredient.name}
              </li>`
            )}
          </ul>
        </div>
      </li>
    `;
  }
}
