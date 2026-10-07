import { describe, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  it.todo('disables previous on first page', async () => {
    const { previousButton } = await mountPaginator({
      offset: 0,
      limit: 5,
      total: 10,
    });

    await expect.element(previousButton).toBeDisabled();
  });

  it.todo('disables next on last page', async () => {
    const { nextButton } = await mountPaginator({
      offset: 5,
      limit: 5,
      total: 10,
    });

    await expect.element(nextButton).toBeDisabled();
  });

  it.todo('emits offsetChange when next is clicked', async () => {
    const { nextButton, offsetChange } = await mountPaginator({
      offset: 0,
      limit: 5,
      total: 10,
    });

    await nextButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it.todo('emits offsetChange when previous is clicked', async () => {
    const { previousButton, offsetChange } = await mountPaginator({
      offset: 5,
      limit: 5,
      total: 10,
    });

    await previousButton.click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(0);
  });
});

async function mountPaginator(inputs: {
  offset: number;
  limit: number;
  total: number;
}) {
  const offsetChange = vi.fn<(offset: number) => void>();

  await t.mount(Paginator, { inputs, outputs: { offsetChange } });

  return {
    nextButton: page.getByRole('button', { name: /next/i }),
    previousButton: page.getByRole('button', { name: /previous/i }),
    offsetChange,
  };
}
