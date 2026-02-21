import { ChangeEvent } from 'react';
import type { RecipeFilterCriteria } from './recipe-filter-criteria';
import styles from './recipe-filter.module.css';

export function RecipeFilter({
  filter,
  onFilterChange,
}: {
  filter: RecipeFilterCriteria;
  onFilterChange: (filter: RecipeFilterCriteria) => void;
}) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    onFilterChange({
      ...filter,
      [name]:
        e.target.type === 'number'
          ? value === ''
            ? undefined
            : Number(value)
          : value || undefined,
    });
  }

  return (
    <div className={styles.filter}>
      <div className={styles.field}>
        <label htmlFor="keywords">Keywords</label>
        <input
          id="keywords"
          name="keywords"
          type="text"
          value={filter.keywords ?? ''}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="maxIngredientCount">Max Ingredients</label>
        <input
          id="maxIngredientCount"
          name="maxIngredientCount"
          type="number"
          value={filter.maxIngredientCount ?? ''}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="maxStepCount">Max Steps</label>
        <input
          id="maxStepCount"
          name="maxStepCount"
          type="number"
          value={filter.maxStepCount ?? ''}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
