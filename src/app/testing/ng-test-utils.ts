import { Provider, ProviderToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export const t = {
  configure,
  inject,
  mount,
};

function configure({ providers }: { providers?: Provider[] }) {
  TestBed.configureTestingModule({ providers });
}

async function mount<T extends object>(
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
  const fixture = TestBed.createComponent(component);

  if (inputs) {
    await setInputs(inputs);
  }

  if (outputs) {
    await setOutputs(outputs);
  }

  await fixture.whenStable();

  return {
    setInputs,
  };

  async function setInputs(inputs: Record<string, unknown>) {
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    await fixture.whenStable();
  }

  async function setOutputs(outputs: Record<string, (...args: any[]) => void>) {
    for (const [output, fn] of Object.entries(outputs)) {
      const cmp = fixture.componentInstance;
      if (!(output in cmp)) {
        throw new Error(`Output ${output} is not a valid output`);
      }
      const sub = (cmp as any)[output].subscribe(fn);
      fixture.componentRef.onDestroy(() => sub.unsubscribe());
    }
  }
}

function inject<T>(token: ProviderToken<T>) {
  return TestBed.inject(token);
}
