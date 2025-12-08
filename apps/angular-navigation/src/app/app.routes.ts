import { Route } from '@angular/router';
import { redirectRecipePathToIdGuard } from './redirect-recipe-path-to-id.guard';
import { bindRecipeIdQueryParamToStore } from './bind-recipe-id-query-param-to-store';

export const appRoutes: Route[] = [
  {
    path: '',
    resolve: { _: bindRecipeIdQueryParamToStore },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: 'selector',
        loadComponent: () => import('./recipe-selector.ng'),
      },
      {
        path: 'viewer',
        canActivate: [redirectRecipePathToIdGuard],
        loadComponent: () => import('./recipe-viewer.ng'),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'selector',
  },
];
