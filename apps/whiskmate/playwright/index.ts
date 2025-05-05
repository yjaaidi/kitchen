import '@angular/compiler';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';
import 'zone.js';
import '../src/styles.css';

import { provideAnimations } from '@angular/platform-browser/animations';
import { beforeMount } from '@jscutlery/playwright-ct-angular/hooks';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from '../src/app/recipe/recipe-repository.fake';
import { recipeMother } from '../src/app/testing/recipe.mother';

beforeMount(async ({ TestBed }) => {
  TestBed.configureTestingModule({
    providers: [provideAnimations(), provideRecipeRepositoryFake()],
  });

  const burger = recipeMother.withBasicInfo('Burger').build();
  const salad = recipeMother.withBasicInfo('Salad').build();
  TestBed.inject(RecipeRepositoryFake).configure({ recipes: [burger, salad] });
});
