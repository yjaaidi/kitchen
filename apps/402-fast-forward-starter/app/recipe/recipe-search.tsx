import { useState } from 'react';
import { RecipeAddButton } from '../meal-planner/recipe-add-button';
import { Catalog } from '../shared/catalog';
import { RecipeFilterForm } from './recipe-filter-form';
import type { RecipeFilter } from './recipe-filter';
import { RecipePreview } from './recipe-preview';
import { useSearchRecipes } from './recipe-repository';

export function RecipeSearch() {
  const [filter, setFilter] = useState<RecipeFilter>({});
  const { data: recipes, isLoading } = useSearchRecipes(filter);

  return (
    <>
      <RecipeFilterForm filter={filter} onFilterChange={setFilter} />
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
