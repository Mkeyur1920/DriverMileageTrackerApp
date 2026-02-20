import { Routes } from '@angular/router';
import { AddDriverMileageComponent } from './add-driver-mileage/add-driver-mileage.component';
import { ViewMileageComponent } from './view-mileage/view-mileage.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportReviewComponent } from './report-review/report-review.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { roleGuard } from '../../core/guards/role.guard';

export default [
  {
    path: 'add-mileage',
    canActivate: [roleGuard],
    data: { breadcrumb: 'Button', roles: ['DRIVER'] },
    component: AddDriverMileageComponent,
  },
  {
    path: 'view-mileage',
    canActivate: [roleGuard],
    data: { breadcrumb: 'Button', roles: ['DRIVER'] },
    component: ViewMileageComponent,
  },
  {
    path: 'reports',
    canActivate: [roleGuard],
    data: { breadcrumb: 'Button', roles: ['ADMIN'] },
    component: ReportsComponent,
  },
  {
    path: 'all-monthly-report',
    canActivate: [roleGuard],
    data: { breadcrumb: 'Button', roles: ['ADMIN'] },
    component: ReportReviewComponent,
  },
  {
    path: 'user-profile/:userId',
    canActivate: [roleGuard],
    data: { breadcrumb: 'Button', roles: ['ADMIN', 'DRIVER'] },
    component: UserProfileComponent,
  },

  { path: '**', redirectTo: '/notfound' },
] as Routes;
