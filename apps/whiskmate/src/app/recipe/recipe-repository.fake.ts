import {
  EnvironmentProviders,
  Injectable,
  makeEnvironmentProviders,
} from '@angular/core';
import { RecipeRepository, RecipeRepositoryDef } from './recipe-repository';
import { defer, delay, Observable, of } from 'rxjs';
import { Recipe } from './recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeRepositoryFake implements RecipeRepositoryDef {
  private _recipes: Recipe[] = [];

  /**
   * This imitates some parts of the real implementation with the following rules:
   * - If keywords is provided, this will filter recipes using keywords (case-insensitive) applied on "name" field only.
   * - If keywords contain "error", an error will be thrown.
   * - If keywords contain "delay", the observable will be delayed by 1 second and "delay" will be removed from keywords.
   * - If no keywords are provided, all recipes will be returned.
   * - If no recipes are found, an empty array will be returned.
   */
  search(keywords?: string): Observable<Recipe[]> {
    return defer(() => {
      keywords = keywords?.toLowerCase();

      const withDelay = keywords?.includes('delay');
      if (keywords && withDelay) {
        keywords = keywords.replace('delay', '').trim();
      }

      /* Oh! You are reading this!? So you might be really curious about fakes!
       * We are happy to see you here🤗!
       * In real-life, there will be more filters like `maxIngredients` and `maxSteps`.
       * Does that mean that you have to implement them here too!?
       *
       * No!
       *
       * You can simply throw an error in that case until you really need them for your tests.
       * e.g.
       * if(maxSteps != null) {
       *   throw new Error('🎭 sorry "maxSteps" are not supported by "RecipeRepositoryFake"');
       * }
       *
       *
       * ... but don't forget to document it! 🤓
       */

      if (keywords?.includes('error')) {
        throw new Error('💥 fake error because keywords contain "error"');
      }

      const recipes = this._recipes.filter((recipe) =>
        keywords ? recipe.name.toLowerCase().includes(keywords) : true,
      );

      const result$ = of(recipes);

      if (withDelay) {
        return result$.pipe(delay(1000));
      }

      return result$;
    });
  }

  configure({ recipes }: { recipes: Recipe[] }) {
    this._recipes = recipes;
  }
}

/**
 * This provides both `RecipeRepository` and `RecipeRepositoryFake`
 * using the same instance of `RecipeRepositoryFake`.
 * This avoids having to manually cast `RecipeRepository` into `RecipeRepositoryFake`.
 */
export function provideRecipeRepositoryFake(): EnvironmentProviders {
  return makeEnvironmentProviders([
    RecipeRepositoryFake,
    {
      provide: RecipeRepository,
      useExisting: RecipeRepositoryFake,
    },
  ]);
}
