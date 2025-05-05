import { expect, test } from '@jscutlery/playwright-ct-angular';
import RecipeSearch from './recipe-search.ng';

test('should search recipes without filtering', async ({ page, mount }) => {
  test.skip();
  await mount(RecipeSearch);

  await expect(page.getByRole('heading', { level: 2 })).toHaveText([
    'Burger',
    'Salad',
  ]);
});

test('should filter recipes by keyword', async ({ page, mount }) => {
  test.skip();
  await mount(RecipeSearch);

  await page.getByLabel('Keywords').fill('Bur');

  await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Burger']);
});

test('should show "no results" message when no recipes match', async ({
  page,
  mount,
}) => {
  test.skip();
  await mount(RecipeSearch);

  await page.getByLabel('Keywords').fill('arecipethatdoesnotexist');

  await expect(page.getByText('no results')).toBeVisible();
});
