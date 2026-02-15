import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    @if (showPagination()) {
      <button type="button" [disabled]="!hasPrevious()" (click)="goPrevious()">
        Previous
      </button>
      <button type="button" [disabled]="!hasNext()" (click)="goNext()">
        Next
      </button>
    }
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();

  protected showPagination = computed(() => this.total() > this.limit());
  protected hasPrevious = computed(() => this.offset() > 0);
  protected hasNext = computed(
    () => this.offset() + this.limit() < this.total(),
  );

  protected goPrevious() {
    this.offsetChange.emit(this.offset() - this.limit());
  }

  protected goNext() {
    this.offsetChange.emit(this.offset() + this.limit());
  }
}
