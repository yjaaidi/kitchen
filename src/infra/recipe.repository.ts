import { generateId } from './generate-id';

export interface Recipe {
  id: string;
  createdAt: Date;
  name: string;
  type: RecipeType;
  pictureUri?: string | null;
}

export type RecipeType = 'entree' | 'plat' | 'dessert';

export class RecipeNotFoundError extends Error {
  name = RecipeNotFoundError.name;
}

class RecipeRepository {
  private _recipes: Recipe[] = [];

  constructor() {
    this.reset();
  }

  addRecipe(args: {
    name: string;
    pictureUri: string | null;
    type: RecipeType;
  }): Recipe {
    const recipe = {
      id: generateId('rec'),
      createdAt: new Date(),
      ...args,
    };
    this._recipes.push(recipe);
    return recipe;
  }

  getRecipe(recipeId: string): Recipe {
    const recipe = this._recipes.find((recipe) => recipe.id === recipeId);
    if (recipe == null) {
      throw new RecipeNotFoundError();
    }
    return recipe;
  }

  searchRecipes({
    keywords,
    offset = 0,
    limit = 10,
  }: {
    keywords?: string;
    offset?: number;
    limit?: number;
  } = {}): { items: Recipe[]; total: number } {
    const recipes =
      keywords != null
        ? this._recipes.filter((recipe) =>
            recipe.name?.toLowerCase().includes(keywords),
          )
        : this._recipes;
    return {
      items: recipes.slice(offset, offset + limit),
      total: recipes.length,
    };
  }

  reset() {
    this._recipes = [
      {
        id: 'rec-burger',
        createdAt: new Date(),
        name: 'Burger',
        type: 'plat',
        pictureUri:
          'https://www.ninkasi.fr/wp-content/uploads/2022/06/header_burger.jpg',
      },
      {
        id: 'rec-salad',
        createdAt: new Date(),
        name: 'Salad',
        type: 'entree',
        pictureUri:
          'https://www.ninkasi.fr/wp-content/uploads/2022/10/lyonnaise.png',
      },
    ];
  }
}

export const recipeRepository = new RecipeRepository();
