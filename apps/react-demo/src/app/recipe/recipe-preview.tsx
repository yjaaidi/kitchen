import { ReactNode } from 'react';
import { Card } from '../shared/card';
import type { Recipe } from './recipe';
import styles from './recipe-preview.module.css';

export function RecipePreview({
  recipe,
  children,
}: {
  recipe: Recipe;
  children?: ReactNode;
}) {
  return (
    <Card pictureUri={recipe.pictureUri} role="article">
      <h2 className={styles.name}>{recipe.name}</h2>
      {children}
    </Card>
  );
}
