import { Component, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { AdminDashboard } from './components/admindashboard';
import { ButtonModule } from 'primeng/button';
import { LoginService } from '../service/login.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, AdminDashboard,ButtonModule,CommonModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">

        <!-- Driver view (non-admin) -->
        <div *ngIf="!isAdmin" class="col-span-2">
            <app-stats-widget class="contents" />
        </div>

        <!-- Admin view -->
        <div *ngIf="isAdmin" class="col-span-12 xl:col-span-6">
            <app-admin-dashboard />
            <!-- <app-recent-sales-widget />
            <app-best-selling-widget /> -->
        </div>

        <div *ngIf="isAdmin" class="col-span-12 xl:col-span-6">
            <!-- <app-revenue-stream-widget />
            <app-notifications-widget /> -->
        </div>
        </div>

    `
})
export class Dashboard implements OnInit{
    constructor(private authService : LoginService){}
    isAdmin : boolean = false;

    ngOnInit(): void {

        const user  = this.authService.getUser();
        if (user.roles.some((role:any) => role.roleName === 'ADMIN')) {
            this.isAdmin = true;
        }else {
            this.isAdmin = false;
        }
        
    }


    
}
