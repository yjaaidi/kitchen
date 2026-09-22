import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CatalogPagerOffsetChange } from './catalog-pager';

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-catalog-pager',
  template: `Catalog pager - 🚧 work in progress`,
})
export class CatalogPager {
  offset = input.required<number>();
  limit = input.required<number>();
  total = input.required<number>();
  offsetChange = output<CatalogPagerOffsetChange>();
}
