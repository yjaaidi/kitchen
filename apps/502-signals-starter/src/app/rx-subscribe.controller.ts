import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Observable, Subscription } from 'rxjs';

export class RxSubscribeController<T> implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _subscription?: Subscription;
  private _source$: Observable<T>;
  value?: T;

  constructor(host: ReactiveControllerHost, source$: Observable<T>) {
    this._host = host;
    this._source$ = source$;
    this._host.addController(this);
  }

  hostConnected() {
    this._subscription = this._source$.subscribe((value) => {
      this.value = value;
      this._host.requestUpdate();
    });
  }

  hostDisconnected() {
    this._subscription?.unsubscribe();
    this._subscription = undefined;
  }
}
