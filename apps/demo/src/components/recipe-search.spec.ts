import type { LitElement } from 'lit';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { RecipeSearch } from './recipe-search';

test('recipe search', async () => {
  mount(RecipeSearch);

  const headings = page.getByRole('heading', { level: 2 });
  await expect.poll(() => headings.length).toBeGreaterThanOrEqual(2);
  await expect.element(headings.first()).toHaveTextContent('Burger');
});

function mount(component: Type<LitElement>) {
  const tagName = customElements.getName(component);
  if (!tagName) {
    throw new Error(`Component ${component.name} is not registered`);
  }
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  return element;
}

type Type<T> = new (...args: unknown[]) => T;
