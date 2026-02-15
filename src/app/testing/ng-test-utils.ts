import {
  inputBinding,
  outputBinding,
  Provider,
  ProviderToken,
  Type,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

export const t = {
  configure,
  inject,
  mount,
};

function configure({ providers }: { providers?: Provider[] }) {
  TestBed.configureTestingModule({ providers });
}

function mount<T extends object>(
  component: Type<T>,
  {
    inputs,
    outputs,
  }: {
    inputs?: Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputs?: Record<string, (...args: any[]) => void>;
  } = {}
) {
  TestBed.createComponent(component, {
    bindings: [
      ...Object.entries(inputs ?? {}).map(([key, value]) =>
        inputBinding(key, () => value)
      ),
      ...Object.entries(outputs ?? {}).map(([key, callback]) =>
        outputBinding(key, callback)
      ),
    ],
  });
}

function inject<T>(token: ProviderToken<T>) {
  return TestBed.inject(token);
}
