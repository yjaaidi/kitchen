import { inject, Injectable, Injector, Service, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Recipe } from '../../recipe/recipe';

const RECIPES_API = 'https://recipes-api.marmicode.io/recipes';

export const RECIPE_IDS = ['rec-burger', 'rec-salad'] as const;

export type RecipeId = (typeof RECIPE_IDS)[number];

@Service()
export class RecipeRepositoryFacade {
  getRecipeIds(): RecipeId[] {
    return Array.from(RECIPE_IDS);
  }

  createRecipeResource(recipeId: Signal<RecipeId>) {
    return httpResource(() => `${RECIPES_API}/${recipeId()}`, {
      parse: (data) => mapApiRecipe(data as ApiRecipe),
    });
  }
}

function mapApiRecipe(api: ApiRecipe): Recipe {
  return {
    id: api.id,
    name: api.name,
    pictureUri: api.picture_uri,
    description: null,
    ingredients: api.ingredients.map((ingredient) => ({ name: ingredient.name })),
    steps: [],
  };
}

interface ApiRecipe {
  id: string;
  name: string;
  picture_uri: string;
  ingredients: Array<{ id: string; name: string }>;
}
