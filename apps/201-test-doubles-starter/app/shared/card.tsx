import { ReactNode } from 'react';
import styles from './card.module.css';

export function Card({
  picture,
  role,
  children,
}: {
  picture?: {
    alt: string;
    uri: string;
  };
  role?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.card} role={role}>
      {picture && (
        <img alt={picture.alt} className={styles.picture} src={picture.uri} />
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
