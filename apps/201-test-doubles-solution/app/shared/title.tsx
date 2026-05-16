import { ReactNode } from 'react';
import styles from './title.module.css';

export function Title({ children }: { children: ReactNode }) {
  return <div className={styles.title}>{children}</div>;
}
