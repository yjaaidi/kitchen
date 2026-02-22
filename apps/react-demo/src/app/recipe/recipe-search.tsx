import { useState } from 'react';
import { RecipeAddButton } from '../meal-planner/recipe-add-button';
import { Catalog } from '../shared/catalog';
import { RecipeFilter } from './recipe-filter';
import type { RecipeFilterCriteria } from './recipe-filter-criteria';
import { RecipePreview } from './recipe-preview';
import { useSearchRecipes } from './recipe-repository';

export function RecipeSearch() {
  const [filter, setFilter] = useState<RecipeFilterCriteria>({});
  const { data: recipes, isLoading } = useSearchRecipes(filter);

  return (
    <>
      <RecipeFilter filter={filter} onFilterChange={setFilter} />
      <Catalog>
        {isLoading ? (
          <div role="status">Loading...</div>
        ) : (
          recipes?.map((recipe) => (
            <RecipePreview key={recipe.id} recipe={recipe}>
              <RecipeAddButton recipe={recipe} />
            </RecipePreview>
          ))
        )}
      </Catalog>
    </>
  );
}
