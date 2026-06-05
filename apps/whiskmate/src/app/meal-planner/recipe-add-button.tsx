import type { Recipe } from '../recipe/recipe';
import { useAppDispatch, useAppSelector } from '../store';
import { addRecipe, selectCanAddRecipe } from './meal-planner';
import styles from './recipe-add-button.module.css';

export function RecipeAddButton({ recipe }: { recipe: Recipe }) {
  const dispatch = useAppDispatch();
  const canAdd = useAppSelector((state) => selectCanAddRecipe(state, recipe));

  return (
    <button
      className={styles.addButton}
      disabled={!canAdd}
      onClick={() => dispatch(addRecipe(recipe))}
    >
      ADD
    </button>
  );
}
