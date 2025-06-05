import '@testing-library/jest-dom/vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import userEvent from '@testing-library/user-event';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);

beforeEach(() => {
  userEvent.setup();
  getTestBed().configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
});
