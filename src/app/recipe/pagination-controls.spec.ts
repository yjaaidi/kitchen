import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { t } from '../testing/ng-test-utils';
import { PaginationControls } from './pagination-controls.ng';

describe(PaginationControls.name, () => {
  it('should display paginator with correct total and page size', async () => {
    await t.mount(PaginationControls, {
      inputs: {
        totalItems: 50,
        pageSize: 12,
        currentPage: 1,
      },
    });

    const paginator = screen.getByLabelText('Select page of recipes');
    expect(paginator).toBeInTheDocument();
  });

  it('should emit page change event when next page clicked', async () => {
    const pageChange = vi.fn<(page: number) => void>();

    await t.mount(PaginationControls, {
      inputs: {
        totalItems: 50,
        pageSize: 12,
        currentPage: 1,
      },
      outputs: { pageChange },
    });

    const nextButton = screen.getByLabelText('Next page');
    await userEvent.click(nextButton);

    expect(pageChange).toHaveBeenCalledWith(2); // 1-based page number
  });

  it('should emit page change event when previous page clicked', async () => {
    const pageChange = vi.fn<(page: number) => void>();

    await t.mount(PaginationControls, {
      inputs: {
        totalItems: 50,
        pageSize: 12,
        currentPage: 2,
      },
      outputs: { pageChange },
    });

    const prevButton = screen.getByLabelText('Previous page');
    await userEvent.click(prevButton);

    expect(pageChange).toHaveBeenCalledWith(1);
  });

  it('should convert 0-based Material index to 1-based page number', async () => {
    const pageChange = vi.fn<(page: number) => void>();

    await t.mount(PaginationControls, {
      inputs: {
        totalItems: 100,
        pageSize: 12,
        currentPage: 1,
      },
      outputs: { pageChange },
    });

    // Click to page 5 (0-based index 4)
    const nextButton = screen.getByLabelText('Next page');
    
    // Navigate through pages
    await userEvent.click(nextButton); // Page 2
    await userEvent.click(nextButton); // Page 3
    await userEvent.click(nextButton); // Page 4
    await userEvent.click(nextButton); // Page 5

    expect(pageChange).toHaveBeenLastCalledWith(5);
    expect(pageChange).toHaveBeenCalledTimes(4);
  });

  it('should show first and last page buttons', async () => {
    await t.mount(PaginationControls, {
      inputs: {
        totalItems: 100,
        pageSize: 12,
        currentPage: 1,
      },
    });

    expect(screen.getByLabelText('First page')).toBeInTheDocument();
    expect(screen.getByLabelText('Last page')).toBeInTheDocument();
  });

  it('should emit correct page when first page clicked', async () => {
    const pageChange = vi.fn<(page: number) => void>();

    await t.mount(PaginationControls, {
      inputs: {
        totalItems: 100,
        pageSize: 12,
        currentPage: 5,
      },
      outputs: { pageChange },
    });

    const firstButton = screen.getByLabelText('First page');
    await userEvent.click(firstButton);

    expect(pageChange).toHaveBeenCalledWith(1);
  });

  it('should emit correct page when last page clicked', async () => {
    const pageChange = vi.fn<(page: number) => void>();

    await t.mount(PaginationControls, {
      inputs: {
        totalItems: 100,
        pageSize: 12,
        currentPage: 1,
      },
      outputs: { pageChange },
    });

    const lastButton = screen.getByLabelText('Last page');
    await userEvent.click(lastButton);

    expect(pageChange).toHaveBeenCalledWith(9); // ceil(100/12) = 9
  });
});

