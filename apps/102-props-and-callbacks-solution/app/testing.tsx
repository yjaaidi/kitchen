import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreApi } from 'zustand';

export function createTestQueryClientWrapper() {
  const queryClient = new QueryClient();
  return function TestQueryClientWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

export function resetStore(store: StoreApi<unknown>): void {
  store.setState(store.getInitialState(), true);
}
