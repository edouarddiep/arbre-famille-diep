import { Routes } from '@angular/router';

export const TREE_ROUTES: Routes = [
  {
    path: '',
    title: 'Famille Diep — arbre généalogique',
    loadComponent: () => import('./tree/tree.component').then(m => m.TreeComponent),
  },
];
