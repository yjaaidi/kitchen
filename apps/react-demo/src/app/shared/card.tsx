import { ReactNode } from 'react';
import styles from './card.module.css';

export function Card({
  pictureUri,
  children,
}: {
  pictureUri?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.card}>
      {pictureUri && (
        <img className={styles.picture} src={pictureUri} alt="" />
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
