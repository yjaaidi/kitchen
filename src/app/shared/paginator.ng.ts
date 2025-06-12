import { Component, ChangeDetectionStrategy } from '@angular/core';
import { input, output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    <button type="button" [disabled]="offset() === 0" (click)="onPrevious()">
      Previous
    </button>
    <button
      type="button"
      [disabled]="offset() + limit() >= total()"
      (click)="onNext()"
    >
      Next
    </button>
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();

  onNext() {
    this.offsetChange.emit(this.offset() + this.limit());
  }

  onPrevious() {
    this.offsetChange.emit(Math.max(0, this.offset() - this.limit()));
  }
}
