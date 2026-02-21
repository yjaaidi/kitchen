import { useEffect, useState } from 'react';
import { Catalog } from '../shared/catalog';
import { RecipeAddButton } from '../meal-planner/recipe-add-button';
import { RecipeFilter } from './recipe-filter';
import type { RecipeFilterCriteria } from './recipe-filter-criteria';
import { RecipePreview } from './recipe-preview';
import { searchRecipes } from './recipe-repository';
import type { Recipe } from './recipe';

export function RecipeSearch() {
  const [filter, setFilter] = useState<RecipeFilterCriteria>({});
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    searchRecipes(filter, abortController.signal)
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
