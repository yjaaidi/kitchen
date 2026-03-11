import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository/recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';
import { recipeMother } from './recipe.mother';

describe(RecipeSearch, () => {
  it('show recipes', async () => {
    const { findRecipeHeadings } = mountRecipeSearch();

    const headings = await findRecipeHeadings();

    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Burger');
    expect(headings[1]).toHaveTextContent('Salad');
  });

  it('filter recipes', async () => {
    const { findRecipeHeadings, typeKeywords } = mountRecipeSearch();

    await typeKeywords('Bur');

    const headings = await findRecipeHeadings();

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Burger');
  });
});

function mountRecipeSearch() {
  TestBed.configureTestingModule({
    providers: [provideRecipeRepositoryFake()],
  });

  TestBed.inject(RecipeRepositoryFake).configure({
    recipes: [
      recipeMother.withBasicInfo('Burger').build(),
      recipeMother.withBasicInfo('Salad').build(),
    ],
  });

  TestBed.createComponent(RecipeSearch);

  return {
    typeKeywords: async (keywords: string) => {
      await userEvent.type(await screen.findByLabelText('Keywords'), keywords);
    },
    findRecipeHeadings: async () => {
      return await screen.findAllByRole('heading', { level: 2 });
    },
  };
}
