import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { RecipeSearch } from './recipe-search';

describe(RecipeSearch.name, () => {
  it('shows all recipes', async () => {
    await render(<RecipeSearch />, { wrapper: WithQueryClient });

    await expect
      .element(page.getByRole('heading').nth(0))
      .toHaveTextContent('Burger');

    await expect
      .element(page.getByRole('heading').nth(1))
      .toHaveTextContent('Salad');
  });
});

function WithQueryClient({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
