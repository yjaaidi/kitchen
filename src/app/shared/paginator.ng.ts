import { Component, ChangeDetectionStrategy } from '@angular/core';
import { input, output } from '@angular/core';

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-paginator',
  template: `RecipePaginator - 🚧 work in progress`,
})
export class RecipePaginator {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<number>();
}
