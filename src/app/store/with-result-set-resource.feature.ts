import { withResource } from '@angular-architects/ngrx-toolkit';
import { computed, inject, resource, Signal } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { ResultSetRepository } from '../result-set.repository';

export function withResultSetResource() {
  return signalStoreFeature(
    withState(initialState),
    withComputed(({ _resultSetId }) => ({
      resultSetId: computed(() => _resultSetId()?.source()),
    })),
    withResource(({ resultSetId }) => {
      const repository = inject(ResultSetRepository);
      return resource({
        params: () => {
          const id = resultSetId();
          return id ? { resultSetId: id } : undefined;
        },
        loader: ({ params: { resultSetId } }) => repository.fetchResultSet(resultSetId),
      });
    }),
    withMethods((store) => ({
      reload() {
        store._reload();
      },
      linkResultSetId(id: Signal<string>) {
        patchState(store, { _resultSetId: { source: id } });
      },
    })),
  );
}

interface ResultSetResourceState {
  _resultSetId: {
    source: Signal<string>;
  } | null;
}

const initialState: ResultSetResourceState = {
  _resultSetId: null,
};
