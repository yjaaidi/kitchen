import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'selector',
    loadComponent: () => import('./recipe-selector.ng'),
  },
  {
    path: 'viewer',
    loadComponent: () => import('./recipe-viewer.ng'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'selector',
  },
];
