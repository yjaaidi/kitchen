import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-catalog',
  template: `<ng-content />`,
  styles: `
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
      padding: 30px 0;
    }
  `,
})
export class Catalog {}
