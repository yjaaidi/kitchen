import { TestBed } from '@angular/core/testing';
import { test as base, expect } from '@testronaut/angular';
import { MealPlanner } from '../meal-planner/meal-planner';
import { Recipe } from './recipe';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository/recipe-repository.fake';
import { RecipeSearch } from './recipe-search.ng';
import { recipeMother } from './recipe.mother';

interface MountRecipeSearch {
  getMealPlannerRecipes: () => Promise<Recipe[]>;
  addRecipeToMealPlanner: (recipe: Recipe) => Promise<void>;
}

const test = base.extend<{
  mountRecipeSearch: () => Promise<MountRecipeSearch>;
}>({
  mountRecipeSearch: async ({ mount, runInBrowser }, use) => {
    const _mountRecipeSearch = async () => {
      await runInBrowser('configure', () => {
        TestBed.configureTestingModule({
          providers: [provideRecipeRepositoryFake()],
        });

        TestBed.inject(RecipeRepositoryFake).setRecipes([
          recipeMother.withBasicInfo('Burger').build(),
          recipeMother.withBasicInfo('Salad').build(),
        ]);
      });

      await mount(RecipeSearch);

      return {
        getMealPlannerRecipes: () =>
          runInBrowser('get MealPlanner recipes', () =>
            TestBed.inject(MealPlanner).recipes(),
          ),
        addRecipeToMealPlanner: (recipe: Recipe) =>
          runInBrowser(
            'add Recipe to MealPlanner',
            { recipe },
            ({ recipe }) => {
              const mealPlanner = TestBed.inject(MealPlanner);
              return mealPlanner.addRecipe(recipe);
            },
          ),
      };
    };

    await use(_mountRecipeSearch);
  },
});

test.describe('RecipeSearch', () => {
  test('shows recipes', async ({ page, mountRecipeSearch }) => {
    await mountRecipeSearch();

    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'Burger',
      'Salad',
    ]);
  });

  test('filters recipes', async ({ page, mountRecipeSearch }) => {
    await mountRecipeSearch();

    await page.getByLabel('Keywords').fill('Bur');

    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'Burger',
    ]);
  });

  test('adds recipe to meal plan', async ({ page, mountRecipeSearch }) => {
    const { getMealPlannerRecipes } = await mountRecipeSearch();

    await page.getByRole('button', { name: 'ADD' }).first().click();

    /* There is only a burger in the meal planner. */
    await expect
      .poll(() => getMealPlannerRecipes())
      .toContainEqual(expect.objectContaining({ name: 'Burger' }));
  });

  test('disables add button if recipe is already in meal plan', async ({
    page,
    mountRecipeSearch,
  }) => {
    const { addRecipeToMealPlanner } = await mountRecipeSearch();

    await addRecipeToMealPlanner(recipeMother.withBasicInfo('Burger').build());

    await expect(
      page.getByRole('button', { name: 'ADD' }).first(),
    ).toBeDisabled();
  });
});
