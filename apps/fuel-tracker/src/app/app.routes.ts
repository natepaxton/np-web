import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [AuthGuard],
  },
];
