import { Route } from '@angular/router';
import { recipeViewerRouterHelper } from './recipe-viewer.router-helper';
import { redirectRecipePathToIdGuard } from './guards/redirect-recipe-path-to-id.guard';
import { syncRecipeIdQueryParamWithStoreGuard } from './guards/sync-recipe-id-query-param-with-store.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
  {
    path: 'landing',
    loadComponent: () => import('./landing.ng'),
  },
  {
    path: '',
    canActivate: [
      redirectRecipePathToIdGuard,
      syncRecipeIdQueryParamWithStoreGuard,
    ],
    runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    children: [
      {
        path: 'selector',
        loadComponent: () => import('./recipe-selector.ng'),
      },
      {
        path: recipeViewerRouterHelper.PATH,
        loadComponent: () => import('./recipe-viewer.ng'),
      },
    ],
  },
];
