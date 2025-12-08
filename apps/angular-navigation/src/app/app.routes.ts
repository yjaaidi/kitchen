import { Route } from '@angular/router';
import { redirectRecipePathToIdGuard } from './redirect-recipe-path-to-id.guard';

export const appRoutes: Route[] = [
  {
    path: 'selector',
    loadComponent: () => import('./recipe-selector.ng'),
  },
  {
    path: 'viewer',
    canActivate: [redirectRecipePathToIdGuard],
    loadComponent: () => import('./recipe-viewer.ng'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'selector',
  },
];
