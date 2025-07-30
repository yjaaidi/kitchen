import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  template: `
    <div class="paginator">
      <button 
        type="button" 
        class="paginator-button paginator-previous"
        [disabled]="isOnFirstPage()"
        (click)="goToPreviousPage()"
        data-testid="previous-button">
        Previous
      </button>
      <span class="paginator-info">
        Page {{ currentPage() }} of {{ totalPages() }}
      </span>
      <button 
        type="button" 
        class="paginator-button paginator-next"
        [disabled]="isOnLastPage()"
        (click)="goToNextPage()"
        data-testid="next-button">
        Next
      </button>
    </div>
  `,
  styles: [`
    .paginator {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      margin: 1rem 0;
    }

    .paginator-button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .paginator-button:hover:not(:disabled) {
      background-color: #f5f5f5;
    }

    .paginator-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .paginator-info {
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class PaginatorComponent {
  total = input.required<number>();
  offset = input.required<number>();
  limit = input.required<number>();
  
  offsetChange = output<number>();

  currentPage(): number {
    return Math.floor(this.offset() / this.limit()) + 1;
  }

  totalPages(): number {
    return Math.ceil(this.total() / this.limit());
  }

  isOnFirstPage(): boolean {
    return this.offset() === 0;
  }

  isOnLastPage(): boolean {
    const nextOffset = this.offset() + this.limit();
    return nextOffset >= this.total();
  }

  goToPreviousPage(): void {
    if (!this.isOnFirstPage()) {
      const newOffset = Math.max(0, this.offset() - this.limit());
      this.offsetChange.emit(newOffset);
    }
  }

  goToNextPage(): void {
    if (!this.isOnLastPage()) {
      const newOffset = this.offset() + this.limit();
      this.offsetChange.emit(newOffset);
    }
  }
}