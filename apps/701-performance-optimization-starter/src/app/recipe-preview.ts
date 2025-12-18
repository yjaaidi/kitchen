import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { Recipe } from './recipe';

/**
 * @property {Recipe} recipe - The recipe to display
 *
 * @slot actions - The actions to display (displayed in all modes)
 */
@customElement('wm-recipe-preview')
export class RecipePreview extends LitElement {
  static override styles = css`
    .recipe,
    .image {
      transition: max-width 0.3s ease-in-out, max-height 0.3s ease-in-out;
    }

    .recipe {
      background-color: var(--background-color-secondary);
      border: 1px solid #ddd;
      border-radius: 12px;
      color: var(--text-color);
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
      color: var(--text-color-secondary);
      font-size: 0.9em;
    }

    .steps {
      color: var(--text-color-secondary);
      font-size: 0.9em;
    }

    .section-title {
      font-size: 0.9em;
      font-weight: italic;
    }

    .compact {
      &.recipe {
        max-width: 300px;
      }

      .image {
        max-height: 100px;
      }

      summary {
        cursor: pointer;
        font-style: italic;
      }
    }

    .actions {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }
  `;

  @property()
  mode: RecipePreviewMode = 'detailed';

  @property({ type: Object })
  recipe?: Recipe;

  protected override render() {
    if (!this.recipe) {
      return;
    }

    const ingredientsTpl = html`<ul class="ingredients">
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
    </ul>`;

    return html`
      <li class=${classMap({ recipe: true, compact: this.mode === 'compact' })}>
        <img
          class="image"
          src=${this.recipe.pictureUri}
          alt="Picture of
                ${this.recipe.name}"
        />
        <div class="content">
          <h2 class="name" part="name">${this.recipe.name}</h2>
          <p class="description">${this.recipe.description}</p>
          ${when(
            this.mode === 'compact',
            () =>
              html`<details>
                <summary>Ingredients</summary>
                ${ingredientsTpl}
              </details>`,
            () => ingredientsTpl
          )}
          <slot class="actions" name="actions"></slot>
        </div>
      </li>
    `;
  }
}

export const RECIPE_PREVIEW_MODES = ['compact', 'detailed'] as const;

export type RecipePreviewMode = (typeof RECIPE_PREVIEW_MODES)[number];
