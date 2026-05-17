import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
