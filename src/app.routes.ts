import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Access } from './app/pages/auth/access';
import { Documentation } from './app/pages/documentation/documentation';

export const appRoutes: Routes = [
    {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full' 
  },
    {
    path: '',
    component: AppLayout,
    children: [
        { path: 'dashboard', component: Dashboard },
        { path: 'screens', loadChildren: () => import('./app/pages/screens/screens-routes') },
        { path: 'documentation', component: Documentation },
        { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
    ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
