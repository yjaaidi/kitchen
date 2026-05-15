import { useSignal } from '@preact/signals-react';
import type { Recipe } from '../recipe/recipe';
import { useComputedValue } from '../shared/signals';
import { mealPlanner } from './meal-planner';
import styles from './recipe-add-button.module.css';

export function RecipeAddButton(props: { recipe: Recipe }) {
  const recipe = useSignal(props.recipe);
  const canAdd = useComputedValue(() => mealPlanner.canAddRecipe(recipe.value));

  return (
    <button
      className={styles.addButton}
      disabled={!canAdd}
      onClick={() => mealPlanner.addRecipe(recipe.value)}
    >
      ADD
    </button>
  );
}
