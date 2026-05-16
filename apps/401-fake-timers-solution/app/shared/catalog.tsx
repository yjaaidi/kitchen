import { ReactNode } from 'react';
import styles from './catalog.module.css';

export function Catalog({ children }: { children: ReactNode }) {
  return <div className={styles.catalog}>{children}</div>;
}
