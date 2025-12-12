import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Recipe } from './recipe';

@customElement('wm-recipe-preview')
export class RecipePreview extends LitElement {
  static override styles = css`
    .recipe {
      border: 1px solid #ddd;
      border-radius: 12px;
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

    .description {
      color: #444;
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
      color: #444;
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
        <div>
          <img
            class="image"
            src="${this.recipe.pictureUri}"
            alt="Picture of
                ${this.recipe.name}"
          />
          <div class="content">
            <h2 class="name">${this.recipe.name}</h2>
            <p class="description">${this.recipe.description}</p>
            <ul class="ingredients">
              ${this.recipe.ingredients.map(
                (ingredient) => html`<li>
                  ${ingredient.quantity
                    ? html`${ingredient.quantity.amount}
                      ${ingredient.quantity.unit} `
                    : nothing}
                  ${ingredient.name}
                </li>`
              )}
            </ul>
          </div>
        </div>
      </li>
    `;
  }
}
