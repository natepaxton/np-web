import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'fuel',
  },
  {
    path: 'fuel',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
];
