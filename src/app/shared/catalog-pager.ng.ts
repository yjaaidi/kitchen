import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CatalogPagerOffsetChange } from './catalog-pager';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-catalog-pager',
  template: `
    <button type="button" [disabled]="!canGoPrevious()" (click)="goPrevious()">
      Previous
    </button>
    <button type="button" [disabled]="!canGoNext()" (click)="goNext()">
      Next
    </button>
  `,
})
export class CatalogPager {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<CatalogPagerOffsetChange>();

  protected canGoPrevious = computed(() => this.offset() > 0);
  protected canGoNext = computed(
    () => this.offset() + this.limit() < this.total(),
  );

  protected goPrevious() {
    this.offsetChange.emit(Math.max(0, this.offset() - this.limit()));
  }

  protected goNext() {
    const lastPageOffset = Math.max(
      0,
      (Math.ceil(this.total() / this.limit()) - 1) * this.limit(),
    );

    this.offsetChange.emit(
      Math.min(this.offset() + this.limit(), lastPageOffset),
    );
  }
}
