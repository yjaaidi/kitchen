import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-increment',
  template: ` <button (click)="value.set(value() + 1)">{{ value() }}</button> `,
})
export class Increment {
  protected value = signal(0);
}
