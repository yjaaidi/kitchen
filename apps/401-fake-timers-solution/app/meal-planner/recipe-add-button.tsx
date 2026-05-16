import type { Recipe } from '../recipe/recipe';
import { useMealPlannerStore } from './meal-planner';
import styles from './recipe-add-button.module.css';

export function RecipeAddButton({ recipe }: { recipe: Recipe }) {
  const canAdd = useMealPlannerStore((s) => s.canAddRecipe(recipe));
  const addRecipe = useMealPlannerStore((s) => s.addRecipe);

  return (
    <button
      className={styles.addButton}
      disabled={!canAdd}
      onClick={() => addRecipe(recipe)}
    >
      ADD
    </button>
  );
}
