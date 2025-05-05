import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'search',
    loadComponent: () =>
      import('./recipe/recipe-search.ng').then((m) => m.RecipeSearch),
  },
  {
    path: '**',
    redirectTo: '/search',
  },
];
