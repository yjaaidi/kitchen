import { ChangeEvent } from 'react';
import { useModel } from '../shared/use-model';
import type { RecipeFilter } from './recipe-filter';
import styles from './recipe-filter-form.module.css';

export function RecipeFilterForm(props: {
  filter: RecipeFilter;
  onFilterChange: (filter: RecipeFilter) => void;
}) {
  const { liveValue: filter, setValue } = useModel({
    initialValue: props.filter,
    onChange: props.onFilterChange,
  });

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const next: RecipeFilter = {
      ...filter,
      [name]:
        e.target.type === 'number'
          ? value === ''
            ? undefined
            : Number(value)
          : value || undefined,
    };
    setValue(next);
  }
}
