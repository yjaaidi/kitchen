import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { ResultSet } from '../result-set';
import { ResultSetRepository } from '../result-set.repository';

const initialState: ResultSetState = {
  resultSet: null,
  isLoading: false,
};

interface ResultSetState {
  resultSet: ResultSet | null;
  isLoading: boolean;
}

export function withResultSetFetching() {
  return signalStoreFeature(
    withState(initialState),
    withMethods((store) => {
      const repository = inject(ResultSetRepository);
      return {
        async fetchResultSet(resultSetId: string) {
          patchState(store, loading());
          try {
            const resultSet = await repository.fetchResultSet(resultSetId);
            patchState(store, { resultSet });
          } finally {
            patchState(store, { isLoading: false });
          }
        },
      };
    }),
  );
}

function loading(): Partial<ResultSetState> {
  return { ...initialState, isLoading: true };
}
