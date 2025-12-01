import { computed } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { withInjectionPinning } from './with-injection-pinning.feature';
import { withResultSetFetching } from './with-result-set.feature';
import { withResource } from '@angular-architects/ngrx-toolkit';
import { withResultSetResource } from './with-result-set-resource.feature';

export const ResultSetStore = signalStore(
  { providedIn: 'root' },
  withInjectionPinning(),
  withResultSetResource(),
  withComputed(({ value, _pinnedItem: pinnedItem }) => ({
    resultTree: computed(() =>
      value()?.injections.map((injection) => ({
        name: injection.name,
        pinned: pinnedItem() === injection.name,
      })),
    ),
  })),
);
