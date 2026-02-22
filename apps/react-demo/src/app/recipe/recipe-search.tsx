import { useEffect, useState } from 'react';
import { RecipeAddButton } from '../meal-planner/recipe-add-button';
import { Catalog } from '../shared/catalog';
import type { Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import type { RecipeFilterCriteria } from './recipe-filter-criteria';
import { RecipePreview } from './recipe-preview';
import { recipeRepository } from './recipe-repository';

export function RecipeSearch() {
  const [filter, setFilter] = useState<RecipeFilterCriteria>({});
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    recipeRepository
      .searchRecipes(filter, abortController.signal)
      .then(setRecipes)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => abortController.abort();
  }, [filter]);

  return (
    <>
      <RecipeFilter filter={filter} onFilterChange={setFilter} />
      <Catalog>
        {recipes.map((recipe) => (
          <RecipePreview key={recipe.id} recipe={recipe}>
            <RecipeAddButton recipe={recipe} />
          </RecipePreview>
        ))}
      </Catalog>
    </>
  );
}
