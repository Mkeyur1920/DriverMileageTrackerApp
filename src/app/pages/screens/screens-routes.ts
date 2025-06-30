import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDriverMileageComponent } from './add-driver-mileage/add-driver-mileage.component';
import { ViewMileageComponent } from './view-mileage/view-mileage.component';
import { ReportsComponent } from './reports/reports.component';

export default [
    { path: 'add-mileage', data: { breadcrumb: 'Button' }, component: AddDriverMileageComponent },
    { path: 'view-mileage', data: { breadcrumb: 'Button' }, component: ViewMileageComponent },
    { path: 'reports',data: { breadcrumb: 'Button' }, component: ReportsComponent },
    
    { path: '**', redirectTo: '/notfound' }
] as Routes;
