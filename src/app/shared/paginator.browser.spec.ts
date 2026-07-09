import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  it('disables previous on first page', async () => {
    const { previousButton } = await mountPaginator({
      offset: 0,
      limit: 5,
      total: 10,
    });

    await expect.element(previousButton).toBeDisabled();
  });

  it('disables next on last page', async () => {
    const { nextButton } = await mountPaginator({
      offset: 5,
      limit: 5,
      total: 10,
    });

    await expect.element(nextButton).toBeDisabled();
  });

  it('emits offsetchange when next is clicked', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();

    const { nextButton } = await mountPaginator(
      { offset: 0, limit: 5, total: 10 },
      { offsetChange },
    );

    await nextButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it('emits offsetchange when previous is clicked', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();

    const { previousButton } = await mountPaginator(
      { offset: 5, limit: 5, total: 10 },
      { offsetChange },
    );

    await previousButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(0);
  });
});

async function mountPaginator(
  inputs: { offset: number; limit: number; total: number },
  outputs?: { offsetChange: (offset: number) => void },
) {
  await t.mount(Paginator, { inputs, outputs });

  return {
    previousButton: page.getByRole('button', { name: 'Previous' }),
    nextButton: page.getByRole('button', { name: 'Next' }),
  };
}
