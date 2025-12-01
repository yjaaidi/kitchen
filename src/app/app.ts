import { Component, effect, inject } from '@angular/core';
import { ResultSetStore } from './store/result-set.store';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="reload()">RELOAD</button>
    @if (store.isLoading()) {
      <div>Loading...</div>
    }

    <ul [class.loading]="store.isLoading()">
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
    this.store.selectResultSet('rs_1');
  }

  reload() {
    this.store.reload();
  }

  pinItem(item: { name: string; pinned: boolean }) {
    this.store.pinItem(item.name);
  }
}
