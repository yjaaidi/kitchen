import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecipeSearch } from './recipe/recipe-search';
import { Title } from './shared/title';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Title>
        <h1>Welcome to Whiskmate</h1>
      </Title>
      <RecipeSearch />
    </QueryClientProvider>
  );
}

export default App;
