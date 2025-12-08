import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { ɵgetCleanupHook as getCleanupHook } from '@angular/core/testing';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import './custom-theme.scss';
import './styles.css';

/* Workaround until https://github.com/analogjs/analog/pull/1995 is merged. */
beforeEach(getCleanupHook(false));
afterEach(getCleanupHook(true));

setupTestBed();
