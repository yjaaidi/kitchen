import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    @if (totalPages() > 1) {
      <button
        [disabled]="currentPage() === 0 || isLoading()"
        (click)="previous.emit()"
      >
        Previous
      </button>
      <span>Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
      <button
        [disabled]="currentPage() === totalPages() - 1 || isLoading()"
        (click)="next.emit()"
      >
        Next
      </button>
    }
  `,
})
export class Paginator {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  isLoading = input<boolean>(false);

  next = output<void>();
  previous = output<void>();
}
