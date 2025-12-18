import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Observable, Subscription } from 'rxjs';

export class RxSubscribeController<T> implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _subscription?: Subscription;
  private _sourceFn: () => Observable<T>;
  value?: T;

  constructor(host: ReactiveControllerHost, sourceFn: () => Observable<T>) {
    this._host = host;
    this._sourceFn = sourceFn;
    this._host.addController(this);
  }

  hostConnected() {
    this._subscription = this._sourceFn().subscribe((value) => {
      this.value = value;
      this._host.requestUpdate();
    });
  }

  hostDisconnected() {
    this._subscription?.unsubscribe();
    this._subscription = undefined;
  }
}
