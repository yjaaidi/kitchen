import '@testing-library/jest-dom';
import 'reflect-metadata';
import { getTestBed, TestBed } from '@angular/core/testing';

import './styles.css';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { beforeEach } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
});
