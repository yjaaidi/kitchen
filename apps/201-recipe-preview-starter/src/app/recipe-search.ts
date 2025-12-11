import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { createRecipe, Recipe } from './recipe';

@customElement('wm-recipe-search')
export class RecipeSearch extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin: auto;
    }

    .search-form {
      display: flex;
      max-width: 400px;
      margin: 1rem auto;

      input {
        flex: 1;
        border: 1px solid #ccc;
        border-radius: 8px 0 0 8px;
        font-size: 1rem;
        padding: 0.5rem 1rem;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
          background: #fff;
        }
      }

      button {
        border: 1px solid #ccc;
        border-left: none;
        border-radius: 0 8px 8px 0;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:hover {
          border-color: #999;
        }
      }
    }

    .title {
      text-align: center;
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      width: 100%;
      line-height: 80px;
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

  @query('input[name="keywords"]')
  private _searchInput?: HTMLInputElement;

  @state()
  private _keywords?: string;
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

  @state()
  private _filteredRecipes: Recipe[] = this._recipes;

  protected override render() {
    return html`<h1 class="title">Recipe Search</h1>

      <form
        class="search-form"
        @input=${() => this._updateKeywords()}
        @submit=${(event: SubmitEvent) => {
          event.preventDefault();
          this._updateKeywords();
        }}
      >
        <input
          class="search-input"
          name="keywords"
          placeholder="Search recipes"
          type="text"
        />
        <button type="submit">🔍</button>
      </form>

      <ul class="recipe-list">
        ${this._filteredRecipes.map(
          (recipe) => html`
            <li class="recipe">
              <div>
                <img
                  class="image"
                  src="${recipe.pictureUri}"
                  alt="Picture of
                ${recipe.name}"
                />
                <div class="content">
                  <h2 class="name">${recipe.name}</h2>
                  <p class="description">${recipe.description}</p>
                  <ul class="ingredients">
                    ${recipe.ingredients.map(
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
          `
        )}
      </ul>`;
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('_keywords')) {
      this._filteredRecipes = this._recipes.filter((recipe) => {
        if (!this._keywords) {
          return true;
        }
        return recipe.name.toLowerCase().includes(this._keywords.toLowerCase());
      });
    }
    super.willUpdate(changedProperties);
  }

  private _updateKeywords() {
    this._keywords = this._searchInput?.value;
  }
}
