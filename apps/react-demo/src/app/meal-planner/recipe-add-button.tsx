import type { Recipe } from '../recipe/recipe';
import { useMealPlanner } from './meal-planner-context';
import styles from './recipe-add-button.module.css';

export function RecipeAddButton({ recipe }: { recipe: Recipe }) {
  const { addRecipe, canAddRecipe } = useMealPlanner();
  const canAdd = canAddRecipe(recipe);

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
