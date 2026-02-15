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

interface MountOptions {
  inputs?: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outputs?: Record<string, (...args: any[]) => void>;

  /**
   * Wait for the component to be stable before returning.
   * This is typically used when assertion retryability is not enough.
   * For example, when asserting that an element is not present or visibile.
   */
  waitStable?: boolean;
}

async function mount<T extends object>(
  component: Type<T>,
  { inputs, outputs, waitStable = false }: MountOptions = {},
) {
  const fixture = TestBed.createComponent(component, {
    bindings: [
      ...Object.entries(inputs ?? {}).map(([key, value]) =>
        inputBinding(key, () => value),
      ),
      ...Object.entries(outputs ?? {}).map(([key, callback]) =>
        outputBinding(key, callback),
      ),
    ],
  });

  if (waitStable) {
    await fixture.whenStable();
  }
}

function inject<T>(token: ProviderToken<T>) {
  return TestBed.inject(token);
}
