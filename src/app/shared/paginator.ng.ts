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
    <button [disabled]="isPreviousDisabled()" type="button" (click)="previous()">
      Previous
    </button>
    <button [disabled]="isNextDisabled()" type="button" (click)="next()">
      Next
    </button>
  `,
})
export class Paginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();

  protected isPreviousDisabled = computed(() => this.offset() === 0);
  protected isNextDisabled = computed(
    () => this.offset() + this.limit() >= this.total(),
  );

  next() {
    this.offsetChange.emit(this.offset() + this.limit());
  }

  previous() {
    this.offsetChange.emit(this.offset() - this.limit());
  }
}
