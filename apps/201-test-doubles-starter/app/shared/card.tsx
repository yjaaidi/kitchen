import { ReactNode } from 'react';
import styles from './card.module.css';

export function Card({
  pictureUri,
  role,
  children,
}: {
  pictureUri?: string;
  role?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.card} role={role}>
      {pictureUri && <img className={styles.picture} src={pictureUri} alt="" />}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
