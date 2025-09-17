import { expect, test } from '@testronaut/angular';
import { Increment } from './increment.ng';

test('Increment', async ({ page, mount }) => {
  await mount(Increment);
  const button = page.getByRole('button');
  await button.click();
  await expect(button).toHaveText('1');
});
