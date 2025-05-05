import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe/recipe-repository.fake';
import { recipeMother } from './testing/recipe.mother';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideRecipeRepositoryFake(),
    provideAppInitializer(() => {
      const burger = recipeMother.withBasicInfo('Burger').build();
      const salad = recipeMother.withBasicInfo('Salad').build();
      const beer = recipeMother.withBasicInfo('Beer').build();
      inject(RecipeRepositoryFake).configure({
        recipes: [burger, salad, beer],
      });
    }),
  ],
};
