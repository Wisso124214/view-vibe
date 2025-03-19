import { Routes } from '@angular/router';
import { routes as tabsRoutes } from './tabs/tabs.routes';

export const routes: Routes = [
  ...tabsRoutes,
  {
    path: 'details-media/:id',
    loadComponent: () => import('./details-media/details-media.page').then( m => m.DetailsMediaPage)
  },
  {
    path: '',
    // loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    redirectTo: 'tabs/movies',
    pathMatch: 'full',
  },
  {
    path: 'backend-data',
    loadComponent: () => import('./backend-data/backend-data.page').then( m => m.BackendDataPage)
  },
];
