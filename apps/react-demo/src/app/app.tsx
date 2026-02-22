import { RecipeSearch } from './recipe/recipe-search';
import { Title } from './shared/title';

export function App() {
  return (
    <>
      <Title>
        <h1>Welcome to Whiskmate</h1>
      </Title>
      <RecipeSearch />
    </>
  );
}

export default App;
