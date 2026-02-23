import { ReactNode } from 'react';
import styles from './card.module.css';
import clsx from 'clsx';

export function Card({
  className,
  pictureUri,
  role,
  children,
}: {
  className?: string;
  pictureUri?: string;
  role?: string;
  children: ReactNode;
}) {
  return (
    <div className={clsx(styles.card, className)} role={role}>
      {pictureUri && <img className={styles.picture} src={pictureUri} alt="" />}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
