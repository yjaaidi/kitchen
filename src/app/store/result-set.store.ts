import { computed } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { withInjectionPinning } from './with-injection-pinning.feature';
import { withResultSetFetching } from './with-result-set.feature';

export const ResultSetStore = signalStore(
  { providedIn: 'root' },
  withInjectionPinning(),
  withResultSetFetching(),
  withComputed(({ resultSet, _pinnedItem: pinnedItem }) => ({
    resultTree: computed(() =>
      resultSet()?.injections.map((injection) => ({
        name: injection.name,
        pinned: pinnedItem() === injection.name,
      })),
    ),
  })),
);
