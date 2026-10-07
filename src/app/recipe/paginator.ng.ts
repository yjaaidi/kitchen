import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    <button
      [disabled]="offset() === 0"
      (click)="offsetChange.emit(offset() - limit())"
    >
      Previous
    </button>
    <button
      [disabled]="offset() + limit() >= total()"
      (click)="offsetChange.emit(offset() + limit())"
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
}
