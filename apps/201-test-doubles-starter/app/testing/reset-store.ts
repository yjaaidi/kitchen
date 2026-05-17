import { StoreApi } from 'zustand';

export function resetStore(store: StoreApi<unknown>): void {
  store.setState(store.getInitialState(), true);
}
