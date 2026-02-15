import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  it('disables "Previous" on first page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 20 },
    });

    const previousButton = page.getByRole('button', { name: 'Previous' });
    await expect.element(previousButton).toBeDisabled();
  });

  it('disables "Next" on last page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 15, limit: 5, total: 20 },
    });

    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect.element(nextButton).toBeDisabled();
  });

  it('emits new offset on "Next" click', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();

    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 20 },
      outputs: { offsetChange },
    });

    await page.getByRole('button', { name: 'Next' }).click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it('emits new offset on "Previous" click', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();

    await t.mount(Paginator, {
      inputs: { offset: 10, limit: 5, total: 20 },
      outputs: { offsetChange },
    });

    await page.getByRole('button', { name: 'Previous' }).click();

    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it('hides pagination when results fit in one page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 3 },
      waitStable: true,
    });

    const previousButton = page.getByRole('button', { name: 'Previous' });
    await expect.element(previousButton).not.toBeInTheDocument();
  });
});
