import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { ResultSet } from './result-set';
import { computed, inject } from '@angular/core';
import { ResultSetRepository } from './result-set.repository';

interface ResultSetState {
  _pinnedItem: string | null;
  resultSet: ResultSet | null;
  loading: boolean;
}

const initialState: ResultSetState = {
  _pinnedItem: null,
  resultSet: null,
  loading: false,
};

export const ResultSetStore = signalStore(
  { providedIn: 'root' },
  withState<ResultSetState>(initialState),
  withComputed(({ resultSet, _pinnedItem }) => {
    return {
      resultTree: computed(() => {
        if (resultSet() == null) {
          return null;
        }

        return resultSet()?.injections.map((injection) => {
          return {
            name: injection.name,
            pinned: _pinnedItem() === injection.name,
          };
        });
      }),
    };
  }),
  withMethods((store) => {
    const repository = inject(ResultSetRepository);

    return {
      pinItem(item: string) {
        patchState(store, { _pinnedItem: item });
      },
      async fetchResultSet(resultSetId: string) {
        patchState(store, loading());
        try {
          const resultSet = await repository.fetchResultSet(resultSetId);
          patchState(store, { resultSet });
        } finally {
          patchState(store, { loading: false });
        }
      },
    };
  }),
);

function loading(): Partial<ResultSetState> {
  return { ...initialState, loading: true };
}
