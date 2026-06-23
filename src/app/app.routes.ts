import { Routes } from '@angular/router';
import { mvpGuard } from './core/guards/mvp.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), pathMatch: 'full' },
      { path: 'repertoire', loadComponent: () => import('./features/repertoire/repertoire.component').then(m => m.RepertoireComponent) },
      // Locked routes — mvpGuard redirects direct URL access to /dashboard/repertoire
      { path: 'members', canActivate: [mvpGuard], loadComponent: () => import('./features/members/members.component').then(m => m.MembersComponent) },
      { path: 'agenda', canActivate: [mvpGuard], loadComponent: () => import('./features/agenda/agenda.component').then(m => m.AgendaComponent) },
      { path: 'profile', canActivate: [mvpGuard], loadComponent: () => import('./features/profile/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '', loadChildren: () => import('./features/landing-page/landing-page.routes').then(m => m.LANDING_PAGE_ROUTES) }
];
