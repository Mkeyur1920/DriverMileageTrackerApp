import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDriverMileageComponent } from './add-driver-mileage/add-driver-mileage.component';
import { ViewMileageComponent } from './view-mileage/view-mileage.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportReviewComponent } from './report-review/report-review.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export default [
  {
    path: 'add-mileage',
    data: { breadcrumb: 'Button' },
    component: AddDriverMileageComponent,
  },
  {
    path: 'view-mileage',
    data: { breadcrumb: 'Button' },
    component: ViewMileageComponent,
  },
  {
    path: 'reports',
    data: { breadcrumb: 'Button' },
    component: ReportsComponent,
  },
  {
    path: 'all-monthly-report',
    data: { breadcrumb: 'Button' },
    component: ReportReviewComponent,
  },
  {
    path: 'user-profile/:userId',
    data: { breadcrumb: 'Button' },
    component: UserProfileComponent,
  },

  { path: '**', redirectTo: '/notfound' },
] as Routes;
