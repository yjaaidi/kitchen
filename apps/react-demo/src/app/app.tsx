import { MealPlannerProvider } from './meal-planner/meal-planner-context';
import { RecipeSearch } from './recipe/recipe-search';
import { Title } from './shared/title';

export function App() {
  return (
    <MealPlannerProvider>
      <Title>
        <h1>Welcome to Whiskmate</h1>
      </Title>
      <RecipeSearch />
    </MealPlannerProvider>
  );
}

export default App;
