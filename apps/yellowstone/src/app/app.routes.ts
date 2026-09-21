import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'photos',
  },
  {
    path: 'photos',
    loadComponent: () => import('./pages/photos/photos').then((m) => m.Photos),
  },
  {
    path: 'fuel',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
];
