import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe/recipe-repository.fake';
import { recipeMother } from './testing/recipe.mother';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideZonelessChangeDetection(),
    provideRecipeRepositoryFake(),
    provideAppInitializer(() => {
      const fake = inject(RecipeRepositoryFake);
      fake.setRecipes([
        recipeMother.withBasicInfo('Burger').build(),
        recipeMother.withBasicInfo('Salad').build(),
        recipeMother.withBasicInfo('Beer').build(),
        recipeMother.withBasicInfo('Another Burger').build(),
        recipeMother.withBasicInfo('Another Salad').build(),
        recipeMother.withBasicInfo('Another Beer').build(),
        recipeMother.withBasicInfo('Vegan Burger').build(),
        recipeMother.withBasicInfo('Vegan Salad').build(),
        recipeMother.withBasicInfo('Vegan Beer').build(),
      ]);
    }),
  ],
};
