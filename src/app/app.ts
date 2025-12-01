import { Component, effect, inject } from '@angular/core';
import { ResultSetStore } from './result-set.store';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="fetch()">REFRESH</button>
    @if (store.loading()) {
      <div>Loading...</div>
    }

    <ul [class.loading]="store.loading()">
      @for (item of store.resultTree(); track item.name) {
        <li>
          <span>{{ item.name }}</span>
          <button [class.pinned]="item.pinned" (click)="pinItem(item)">📌</button>
        </li>
      }
    </ul>
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

  constructor() {
    this.fetch();
  }

  fetch() {
    this.store.fetchResultSet('rs_1');
  }

  pinItem(item: { name: string; pinned: boolean }) {
    this.store.pinItem(item.name);
  }
}
