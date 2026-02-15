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
      <div class="paginator">
        <button
          type="button"
          class="nav-btn"
          [disabled]="!hasPrevious()"
          (click)="goPrevious()"
        >
          Previous
        </button>
        <button
          type="button"
          class="nav-btn"
          [disabled]="!hasNext()"
          (click)="goNext()"
        >
          Next
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .paginator {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgb(163, 212, 255);
      border-radius: 9999px;
      overflow: hidden;
    }

    .nav-btn {
      padding: 0.5em 1em;
      border: none;
      border-right: 1px solid rgb(163, 212, 255);
      background: white;
      color: rgb(105, 105, 105);
      cursor: pointer;
      font: inherit;
    }

    .nav-btn:last-child {
      border-right: none;
    }

    .nav-btn:hover:not(:disabled) {
      background: rgb(245, 250, 255);
    }

    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
