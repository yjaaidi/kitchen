import { signalStoreFeature, withState, withMethods, patchState } from '@ngrx/signals';

export function withInjectionPinning() {
  return signalStoreFeature(
    withState<{ _pinnedItem: string | null }>({
      _pinnedItem: null,
    }),
    withMethods((store) => {
      return {
        pinItem(item: string) {
          patchState(store, { _pinnedItem: item });
        },
      };
    }),
  );
}
