import { describe, it } from 'vitest';
import { screen } from '@testing-library/angular';
import { Paginator } from './paginator.ng';
import { t } from '../testing/ng-test-utils';
import userEvent from '@testing-library/user-event';

describe(Paginator.name, () => {
  it('Disables previous button on first page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 7 },
    });
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('Disables next button on last page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 5, limit: 5, total: 7 },
    });
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('Emits offsetChange when next is clicked', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();
    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 7 },
      outputs: { offsetChange },
    });
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });

  it('Emits offsetChange when previous is clicked', async () => {
    const offsetChange = vi.fn<(offset: number) => void>();
    await t.mount(Paginator, {
      inputs: { offset: 10, limit: 5, total: 15 },
      outputs: { offsetChange },
    });
    const prevButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(prevButton);
    expect(offsetChange).toHaveBeenCalledExactlyOnceWith(5);
  });
});
