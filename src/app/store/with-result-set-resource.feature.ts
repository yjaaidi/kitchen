import { withResource } from '@angular-architects/ngrx-toolkit';
import { inject, resource } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ResultSetRepository } from '../result-set.repository';

export function withResultSetResource() {
  return signalStoreFeature(
    withState(initialState),
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
      selectResultSet(id: string) {
        patchState(store, { resultSetId: id });
      },
    })),
  );
}

interface ResultSetResourceState {
  resultSetId: string | null;
}

const initialState: ResultSetResourceState = {
  resultSetId: null,
};
