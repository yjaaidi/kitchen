import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { RecipeSearch } from './recipe/recipe-search';
import { Title } from './shared/title';
import { store } from './store';

const queryClient = new QueryClient();

export function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      <Title>
        <h1>Welcome to Whiskmate</h1>
      </Title>
        <RecipeSearch />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
