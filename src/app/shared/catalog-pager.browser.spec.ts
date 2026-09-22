import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { CatalogPager } from './catalog-pager.ng';

describe(CatalogPager.name, () => {
  it('disables previous at offset zero', async () => {
    const { previousButton, nextButton } = await mountCatalogPager({
      offset: 0,
      limit: 5,
      total: 10,
    });

    await expect.element(previousButton).toBeDisabled();
    await expect.element(nextButton).toBeEnabled();
  });

  it('disables next on the last page', async () => {
    const { previousButton, nextButton } = await mountCatalogPager({
      offset: 5,
      limit: 5,
      total: 6,
    });

    await expect.element(nextButton).toBeDisabled();
    await expect.element(previousButton).toBeEnabled();
  });

  it('emits offsetChange when next is clicked', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();

    const { nextButton } = await mountCatalogPager(
      { offset: 0, limit: 5, total: 10 },
      { outputs: { offsetChange } },
    );

    await nextButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });
});

async function mountCatalogPager(
  inputs: {
    offset: number;
    limit: number;
    total: number;
  },
  options: {
    outputs?: Record<string, (...args: unknown[]) => void>;
  } = {},
) {
  t.configure({});

  await t.mount(CatalogPager, { inputs, ...options });

  return {
    previousButton: page.getByRole('button', { name: 'Previous' }),
    nextButton: page.getByRole('button', { name: 'Next' }),
  };
}
