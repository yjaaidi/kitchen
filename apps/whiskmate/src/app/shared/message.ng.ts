import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-message',
  template: ` <ng-content />`,
  styles: [
    `
      :host {
        color: #666;
        display: block;
        font-size: 1.5em;
        margin: 1em auto;
        text-align: center;
      }
    `,
  ],
})
export class Message {}
