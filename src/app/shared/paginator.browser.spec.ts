import { describe, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { t } from '../testing/ng-test-utils';
import { Paginator } from './paginator.ng';

describe(Paginator.name, () => {
  describe('when totalPages <= 1', () => {
    it('should render nothing when totalPages is 0', async () => {
      await mountPaginator({ currentPage: 0, totalPages: 0, waitStable: true });
      await expect
        .element(page.getByText(/Page \d+ of \d+/))
        .not.toBeInTheDocument();
    });

    it('should render nothing when totalPages is 1', async () => {
      await mountPaginator({ currentPage: 0, totalPages: 1, waitStable: true });
      await expect
        .element(page.getByText(/Page \d+ of \d+/))
        .not.toBeInTheDocument();
    });
  });

  describe('page label', () => {
    it('should show "Page 1 of 3" when currentPage is 0 and totalPages is 3', async () => {
      await mountPaginator({ currentPage: 0, totalPages: 3 });
      await expect.element(page.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('should show "Page 2 of 3" when currentPage is 1 and totalPages is 3', async () => {
      await mountPaginator({ currentPage: 1, totalPages: 3 });
      await expect.element(page.getByText('Page 2 of 3')).toBeInTheDocument();
    });
  });

  describe('Previous button', () => {
    it('should be disabled on the first page', async () => {
      await mountPaginator({ currentPage: 0, totalPages: 3 });
      await expect
        .element(page.getByRole('button', { name: 'Previous' }))
        .toBeDisabled();
    });

    it('should be enabled on the second page', async () => {
      await mountPaginator({ currentPage: 1, totalPages: 3 });
      await expect
        .element(page.getByRole('button', { name: 'Previous' }))
        .toBeEnabled();
    });

    it('should be disabled when isLoading is true', async () => {
      await mountPaginator({ currentPage: 1, totalPages: 3, isLoading: true });
      await expect
        .element(page.getByRole('button', { name: 'Previous' }))
        .toBeDisabled();
    });

    it('should emit previous when clicked', async () => {
      const onPrevious = vi.fn();
      await mountPaginator({ currentPage: 1, totalPages: 3, onPrevious });
      await page.getByRole('button', { name: 'Previous' }).click();
      expect(onPrevious).toHaveBeenCalledOnce();
    });
  });

  describe('Next button', () => {
    it('should be enabled on the first page', async () => {
      await mountPaginator({ currentPage: 0, totalPages: 3 });
      await expect
        .element(page.getByRole('button', { name: 'Next' }))
        .toBeEnabled();
    });

    it('should be disabled on the last page', async () => {
      await mountPaginator({ currentPage: 2, totalPages: 3 });
      await expect
        .element(page.getByRole('button', { name: 'Next' }))
        .toBeDisabled();
    });

    it('should be disabled when isLoading is true', async () => {
      await mountPaginator({ currentPage: 0, totalPages: 3, isLoading: true });
      await expect
        .element(page.getByRole('button', { name: 'Next' }))
        .toBeDisabled();
    });

    it('should emit next when clicked', async () => {
      const onNext = vi.fn();
      await mountPaginator({ currentPage: 0, totalPages: 3, onNext });
      await page.getByRole('button', { name: 'Next' }).click();
      expect(onNext).toHaveBeenCalledOnce();
    });
  });
});

async function mountPaginator({
  currentPage,
  totalPages,
  isLoading = false,
  onNext,
  onPrevious,
  waitStable = false,
}: {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  waitStable?: boolean;
}) {
  t.configure({ providers: [] });
  return t.mount(Paginator, {
    inputs: { currentPage, totalPages, isLoading },
    outputs: {
      ...(onNext ? { next: onNext } : {}),
      ...(onPrevious ? { previous: onPrevious } : {}),
    },
    waitStable,
  });
}
