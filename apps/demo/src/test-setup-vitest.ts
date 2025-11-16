import '@angular/compiler';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

beforeEach(() => {
  getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting(),
  );
});

afterEach(() => {
  getTestBed().resetTestEnvironment();
});
