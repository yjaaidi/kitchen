import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-pagination-controls',
  imports: [MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="totalItems()"
      [pageSize]="pageSize()"
      [pageIndex]="currentPage() - 1"
      [pageSizeOptions]="[]"
      [showFirstLastButtons]="true"
      (page)="onPageChange($event)"
      aria-label="Select page of recipes">
    </mat-paginator>
  `,
  styles: `
    :host {
      display: block;
      margin-top: 2rem;
    }
  `,
})
export class PaginationControls {
  totalItems = input.required<number>();
  pageSize = input.required<number>();
  currentPage = input.required<number>();

  pageChange = output<number>();

  onPageChange(event: PageEvent): void {
    // Convert 0-based index to 1-based page number
    this.pageChange.emit(event.pageIndex + 1);
  }
}

