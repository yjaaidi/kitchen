import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import '@testing-library/jest-dom/vitest';
import './styles.css';

import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed({ browserMode: true });
