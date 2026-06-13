import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe/recipe-repository.fake';
import { createSeedRecipes } from './recipe/seed-recipes';

function universalImageLoader(config: ImageLoaderConfig): string {
  return config.src;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    { provide: IMAGE_LOADER, useValue: universalImageLoader },
    provideRecipeRepositoryFake(),
    provideAppInitializer(() => {
      const fake = inject(RecipeRepositoryFake);
      fake.setRecipes(createSeedRecipes());
    }),
  ],
};
