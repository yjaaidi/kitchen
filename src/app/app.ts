import { Component, inject, input, signal } from '@angular/core';
import { ResultSetStore } from './store/result-set.store';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="reload()">RELOAD</button>
    @if (store.isLoading()) {
      <div>Loading...</div>
    }

    @if (store.error()) {
      <div>Error: {{ store.error() }}</div>
    }

    @if (store.hasValue()) {
      <ul [class.loading]="store.isLoading()">
        @for (item of store.resultTree(); track item.name) {
          <li>
            <span>{{ item.name }}</span>
            <button [class.pinned]="item.pinned" (click)="pinItem(item)">📌</button>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    .loading {
      filter: blur(2px);
    }
    .pinned {
      filter: grayscale(70%);
    }
  `,
})
export class App {
  store = inject(ResultSetStore);

  /* TODO: should be a router input binding. */
  // resultSetId = input.required<string>();
  resultSetId = signal<string>('rs_1');

  constructor() {
    this.store.linkResultSetId(this.resultSetId);
  }

  reload() {
    this.store.reload();
  }

  pinItem(item: { name: string; pinned: boolean }) {
    this.store.pinItem(item.name);
  }
}
