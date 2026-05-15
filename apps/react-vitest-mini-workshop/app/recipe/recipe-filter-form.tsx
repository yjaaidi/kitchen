import { ChangeEvent, useRef, useState } from 'react';
import type { RecipeFilter } from './recipe-filter';
import styles from './recipe-filter-form.module.css';

export function RecipeFilterForm(props: {
  filter: RecipeFilter;
  onFilterChange: (filter: RecipeFilter) => void;
}) {
  const { onFilterChange } = props;
  const [filter, setFilter] = useLocalState(props.filter);

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
    setFilter(next);
    onFilterChange(next);
  }
}

/**
 * Creates a local state that is reset when the prop changes.
 */
function useLocalState<T>(prop: T): [T, (next: T) => void] {
  const [localValue, setLocalValue] = useState(prop);
  const prevPropRef = useRef(prop);
  const isDirtyRef = useRef(false);

  if (prevPropRef.current !== prop) {
    prevPropRef.current = prop;
    isDirtyRef.current = false;
  }

  /* Local state changed. */
  return [
    isDirtyRef.current ? localValue : prop,
    (next: T) => {
      isDirtyRef.current = true;
      setLocalValue(next);
    },
  ];
}
