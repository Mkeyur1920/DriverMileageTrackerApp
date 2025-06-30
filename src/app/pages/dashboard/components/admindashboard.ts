import { Component, OnInit } from '@angular/core';
import { MileageRecordService } from '../../service/mileage-records.service';
import { UserService } from '../../service/user.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-admin-dashboard',
    imports: [ ButtonModule
    ],
    template: `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div class="p-card p-4 shadow-md rounded bg-surface-100">
            <h4>Total Drivers</h4>
            <div class="text-xl font-bold text-primary">{{ totalDrivers }}</div>
        </div>

        <div class="p-card p-4 shadow-md rounded bg-surface-100">
            <h4>Monthly Mileage Records</h4>
            <div class="text-xl font-bold text-primary">{{ totalMileageThisMonth }}</div>
        </div>

        <div class="p-card p-4 shadow-md rounded bg-surface-100">
            <h4>Total Kilometers</h4>
            <div class="text-xl font-bold text-primary">{{ totalKm }}</div>
        </div>

        <div class="p-card p-4 shadow-md rounded bg-surface-100">
            <h4>Pending Submissions</h4>
            <div class="text-xl font-bold text-primary">{{ pendingReports }}</div>
        </div>
        </div>

        <hr class="my-6" />

        <div class="p-4 bg-surface-50 rounded shadow-sm mt-4">
        <h3>Quick Report Access</h3>
        <p-button class="mr-2">View All Reports</p-button>
        <p-button class="mr-2">Download Monthly PDF</p-button>
        </div>

    `
})
export class AdminDashboard implements OnInit {
    totalDrivers = 0;
  totalMileageThisMonth = 0;
  totalKm = 0;
  pendingReports = 0;

   constructor(
    private userService: UserService,
    private mileageService: MileageRecordService
  ) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe(users => {
      this.totalDrivers = users.length;
    });

    this.mileageService.getAll().subscribe(records => {
      const currentMonth = new Date().toISOString().slice(0, 7);
      this.totalMileageThisMonth = records.filter(r =>
        r.date.startsWith(currentMonth)
      ).length;

      this.totalKm = records.reduce((sum, r) => sum + (r.endKm - r.startKm), 0);

      // Optional logic if you track pending submissions
      this.pendingReports = records.filter(r => r.status === 'PENDING').length;
    });
  }
}

