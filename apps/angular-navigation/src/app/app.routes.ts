import { Route } from '@angular/router';
import { recipeResolverConfig } from './recipe.resolver';

export const appRoutes: Route[] = [
  {
    path: 'selector',
    loadComponent: () => import('./recipe-selector.ng'),
  },
  {
    path: 'viewer',
    loadComponent: () => import('./recipe-viewer.ng'),
    resolve: {
      ...recipeResolverConfig,
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'selector',
  },
];
