import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home.ng').then((m) => m.HomeComponent),
  },
  {
    path: 'demos/slow-synchronization',
    title: 'Slow Synchronization',
    loadComponent: () =>
      import('./demos/slow-synchronization/recipe-search.ng'),
  },
  {
    path: 'demos/slow-filtering',
    title: 'Slow Filtering',
    loadComponent: () => import('./demos/slow-filtering/recipe-search.ng'),
  },
  {
    path: 'demos/network-congestion',
    title: 'Network Congestion',
    loadComponent: () => import('./demos/network-congestion/recipe-detail.ng'),
  },
  {
    path: 'demos/slow-load',
    title: 'Slow Load',
    loadComponent: () => import('./demos/slow-load/recipe-search.ng'),
  },
];
