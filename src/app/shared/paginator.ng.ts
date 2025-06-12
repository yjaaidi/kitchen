import { Component, ChangeDetectionStrategy } from '@angular/core';
import { input, output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    <div class="wm-paginator-container">
      <button
        type="button"
        [disabled]="offset() === 0"
        (click)="onPrevious()"
        class="wm-paginator-btn wm-paginator-btn-prev"
      >
        <span class="wm-paginator-arrow">&#8592;</span> Previous
      </button>
      <button
        type="button"
        [disabled]="offset() + limit() >= total()"
        (click)="onNext()"
        class="wm-paginator-btn wm-paginator-btn-next"
      >
        Next <span class="wm-paginator-arrow">&#8594;</span>
      </button>
    </div>
  `,
  styles: [
    `
      .wm-paginator-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
      .wm-paginator-btn {
        border: 2px solid #2196f3;
        background: white;
        color: #757575;
        padding: 0.5rem 1.5rem;
        font-size: 1.1rem;
        cursor: pointer;
        outline: none;
        transition: background 0.2s, color 0.2s;
        min-width: 120px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .wm-paginator-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .wm-paginator-btn-prev {
        border-radius: 2rem 0 0 2rem;
      }
      .wm-paginator-btn-next {
        border-radius: 0 2rem 2rem 0;
      }
      .wm-paginator-arrow {
        font-size: 1.3rem;
      }
    `,
  ],
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
