import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { openapiSpecPath } from '../../infra/openapi-spec';
import { createApp } from '../../start-service';
import { getRecipesRouter } from './get-recipes.router';
import { recipeRepository } from '../../infra/recipe.repository';

describe('GET /recipes', () => {
  it('filters recipes by keyword', async () => {
    const { client } = setUp();

    recipeRepository.addRecipe({
      name: 'Raclette',
      type: 'plat',
      pictureUri: null,
    });

    recipeRepository.addRecipe({
      name: 'Pizza',
      type: 'plat',
      pictureUri: null,
    });

    const response = await client.get('/recipes').query({ q: 'pizz' });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      total: 1,
      items: [
        expect.objectContaining({
          name: 'Pizza',
        }),
      ],
    });
  });

  it('paginates recipes with offset', async () => {
    const { client } = setUp();

    const response = await client.get('/recipes').query({ offset: 1 });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      total: 2,
      items: [
        expect.objectContaining({
          name: 'Salad',
        }),
      ],
    });
  });

  it('limit recipes count to limit', async () => {
    const { client } = setUp();

    const response = await client.get('/recipes').query({ limit: 1 });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      total: 2,
      items: [expect.objectContaining({ name: 'Burger' })],
    });
  });
});

function setUp() {
  recipeRepository.reset();
  const app = createApp({
    spec: openapiSpecPath,
    handlers: getRecipesRouter,
  });
  return {
    client: supertest(app),
  };
}
