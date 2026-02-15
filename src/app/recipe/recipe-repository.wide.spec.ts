import { firstValueFrom } from 'rxjs';
import { describe, it } from 'vitest';
import { t } from '../testing/ng-test-utils';
import { RecipeRepository } from './recipe-repository';

describe(RecipeRepository.name, () => {
  it('returns paginated results', async () => {
    const repo = t.inject(RecipeRepository);
    const page = await firstValueFrom(repo.search({ offset: 0, limit: 2 }));
    expect(page.recipes.length).toBeLessThanOrEqual(2);
    expect(typeof page.total).toBe('number');
    expect(page.total).toBeGreaterThanOrEqual(0);
  });

  it('second page returns different recipes', async () => {
    const repo = t.inject(RecipeRepository);
    const page1 = await firstValueFrom(repo.search({ offset: 0, limit: 2 }));
    const page2 = await firstValueFrom(repo.search({ offset: 2, limit: 2 }));
    const ids1 = new Set(page1.recipes.map((r) => r.id));
    const ids2 = new Set(page2.recipes.map((r) => r.id));
    expect(ids1).not.toEqual(ids2);
  });

  it('offset beyond total returns empty', async () => {
    const repo = t.inject(RecipeRepository);
    const { total } = await firstValueFrom(
      repo.search({ offset: 0, limit: 1 }),
    );
    const beyondPage = await firstValueFrom(
      repo.search({ offset: total, limit: 1 }),
    );
    expect(beyondPage.recipes).toHaveLength(0);
  });
});
