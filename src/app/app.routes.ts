import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'details-media',
    loadComponent: () => import('./details-media/details-media.page').then( m => m.DetailsMediaPage)
  },
];
