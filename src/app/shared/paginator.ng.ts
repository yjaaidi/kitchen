import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `Paginator - 🚧 work in progress`,
})
export class Paginator {
  offset = model.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
}
