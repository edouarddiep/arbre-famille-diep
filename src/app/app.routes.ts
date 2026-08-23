import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/tree/tree.routes').then(m => m.TREE_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
