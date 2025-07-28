import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  it.todo('Disable previous button when on first page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 10 },
    });

    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it.todo('Disable next button when on last page', async () => {
    await t.mount(Paginator, {
      inputs: { offset: 5, limit: 5, total: 10 },
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it.todo('Emit offsetChange when next button is clicked', async () => {
    const offsetChangeSpy = vi.fn();

    await t.mount(Paginator, {
      inputs: { offset: 0, limit: 5, total: 10 },
      outputs: { offsetChange: offsetChangeSpy },
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    expect(offsetChangeSpy).toHaveBeenCalledExactlyOnceWith(5);
  });

  it.todo('Emit offsetChange when previous button is clicked', async () => {
    const offsetChangeSpy = vi.fn();

    await t.mount(Paginator, {
      inputs: { offset: 10, limit: 5, total: 15 },
      outputs: { offsetChange: offsetChangeSpy },
    });

    const previousButton = screen.getByRole('button', { name: /previous/i });
    await userEvent.click(previousButton);

    expect(offsetChangeSpy).toHaveBeenCalledExactlyOnceWith(5);
  });
});
