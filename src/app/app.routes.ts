import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demos/whiskmate/whiskmate.ng'),
  },
];
