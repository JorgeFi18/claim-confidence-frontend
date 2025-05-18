import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'claims',
        pathMatch: 'full'
      },
      {
        path: 'claims',
        loadChildren: () => import('./features/claims/claims.module').then(m => m.ClaimsModule)
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
