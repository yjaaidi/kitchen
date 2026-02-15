import { describe, it } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  it.todo('disables "Previous" on first page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 20 },
    });

    const previousButton = page.getByRole('button', { name: 'Previous' });

    await expect.element(previousButton).toBeDefined();
  });

  it.todo('disables "Next" on last page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 15, limit: 5, total: 20 },
    });

    const nextButton = page.getByRole('button', { name: 'Next' });

    await expect.element(nextButton).toBeDisabled();
  });

  it.todo('enables both buttons on a middle page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 5, limit: 5, total: 20 },
    });

    const previousButton = page.getByRole('button', { name: 'Previous' });
    const nextButton = page.getByRole('button', { name: 'Next' });

    await expect.element(previousButton).toBeEnabled();
    await expect.element(nextButton).toBeEnabled();
  });

  it.todo('emits new offset on "Next" click', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();

    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 20 },
      outputs: { offsetChange },
    });

    await page.getByRole('button', { name: 'Next' }).click();

    expect(offsetChange).toHaveBeenCalledWith(5);
  });

  it.todo('emits new offset on "Previous" click', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();

    await t.mount(Paginator, {
      inputs: { offset: 10, limit: 5, total: 20 },
      outputs: { offsetChange },
    });

    await page.getByRole('button', { name: 'Previous' }).click();

    expect(offsetChange).toHaveBeenCalledWith(5);
  });

  it.todo('hides pagination when results fit in one page', async () => {
    await await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 3 },
    });

    const previousButton = page.getByRole('button', { name: 'Previous' });

    await expect.element(previousButton).not.toBeVisible();
  });
});
