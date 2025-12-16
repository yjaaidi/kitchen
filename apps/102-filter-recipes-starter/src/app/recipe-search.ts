import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRecipe, Recipe } from './recipe';
import { when } from 'lit/directives/when.js';

@customElement('wm-recipe-search')
export class RecipeSearch extends LitElement {
  static override styles = css`
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 80px;
      width: 100%;
    }

    .title {
      color: white;
      margin: 0;
    }

    .search-form {
      display: flex;
      justify-content: center;
      margin: 1rem auto;
    }

    .recipe-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

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

    .quantity {
      font-style: italic;
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

  private _recipes: Recipe[] = [
    createRecipe({
      id: 'rec_burger',
      description: 'A burger with a lot of cheese',
      name: 'Burger',
      pictureUri:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ingredients: [
        {
          name: 'Steak',
          quantity: { amount: 150, unit: 'g' },
        },
        {
          name: 'Cheese',
          quantity: { amount: 50, unit: 'g' },
        },
        {
          name: 'Bread',
          quantity: { amount: 30, unit: 'g' },
        },
        {
          name: 'Tomato',
          quantity: { amount: 30, unit: 'g' },
        },
        {
          name: 'Lettuce',
          quantity: { amount: 30, unit: 'g' },
        },
      ],
      steps: ['Step 1: Cook the steak', 'Step 2: Add all the other stuff'],
    }),
    createRecipe({
      id: 'rec_pizza',
      description: 'A pizza with a lot of cheese',
      name: 'Pizza',
      pictureUri:
        'https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ingredients: [],
      steps: [],
    }),
  ];

  protected override render() {
    return html`<header class="toolbar">
        <h1 class="title">Recipe Search</h1>
      </header>

      <form class="search-form">
        <input name="keywords" placeholder="Search recipes" type="text" />
        <button type="submit">🔍</button>
      </form>

      <ul class="recipe-list">
        ${this._recipes.map(
          (recipe) => html`
            <li class="recipe">
              <div>
                <img
                  class="image"
                  src=${recipe.pictureUri}
                  alt="Picture of ${recipe.name}"
                />
                <div class="content">
                  <h2 class="name">${recipe.name}</h2>
                  <p class="description">${recipe.description}</p>
                  <ul class="ingredients">
                    ${recipe.ingredients.map(
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
              </div>
            </li>
          `
        )}
      </ul>`;
  }
}
