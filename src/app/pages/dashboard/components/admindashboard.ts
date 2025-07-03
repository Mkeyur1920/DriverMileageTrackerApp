import { Component, OnInit } from '@angular/core';
import { MileageRecordService } from '../../service/mileage-records.service';
import { UserService } from '../../service/user.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MonthlyReportService } from '../../service/monthly-report.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ButtonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-card p-4 shadow-md rounded bg-surface-100">
        <h4>Total Drivers</h4>
        <div class="text-xl font-bold text-primary">{{ totalDrivers }}</div>
      </div>

      <div class="p-card p-4 shadow-md rounded bg-surface-100">
        <h4>Monthly Mileage Records</h4>
        <div class="text-xl font-bold text-primary">
          {{ totalMileageThisMonth }}
        </div>
      </div>

      <div class="p-card p-4 shadow-md rounded bg-surface-100">
        <h4>Total Kilometers</h4>
        <div class="text-xl font-bold text-primary">{{ totalKm }}</div>
      </div>

      <div class="p-card p-4 shadow-md rounded bg-surface-100">
        <h4>Pending Submissions</h4>
        <div class="text-xl font-bold text-primary">{{ pendingReports }}</div>
      </div>
      <div class="p-card p-4 shadow-md rounded bg-surface-100">
        <h4>Generated Submissions</h4>
        <div class="text-xl font-bold text-primary">{{ generatedReports }}</div>
      </div>
    </div>

    <hr class="my-6" />

    <div class="p-4 bg-surface-50 rounded shadow-sm mt-4">
      <h3>Quick Report Access</h3>
      <p-button (onClick)="onAllReport()" class="mr-2"
        >View All Reports</p-button
      >
      <!-- <p-button class="mr-2">Download Monthly PDF</p-button> -->
    </div>
  `,
})
export class AdminDashboard implements OnInit {
  totalDrivers = 0;
  totalMileageThisMonth = 0;
  totalKm = 0;
  pendingReports = 0;
  generatedReports = 0;

  constructor(
    private userService: UserService,
    private router: Router,

    private mileageService: MileageRecordService,
    private monthlyReportService: MonthlyReportService,
  ) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((users) => {
      this.totalDrivers = users.filter((u: any) =>
        u.roles.some((r: any) => r.roleName !== 'ADMIN'),
      ).length;
    });

    this.mileageService.getAll().subscribe((records) => {
      const currentMonth = new Date().toISOString().slice(0, 7);
      this.totalMileageThisMonth = records.filter((r) =>
        r.date.startsWith(currentMonth),
      ).length;

      this.totalKm = records.reduce((sum, r) => sum + (r.endKm - r.startKm), 0);

      // Optional logic if you track pending submissions
      this.monthlyReportService.getAllReports().subscribe({
        next: (res) => {
          this.pendingReports = res.filter(
            (r) => r.status === 'PENDING',
          ).length;
          this.generatedReports = res.filter(
            (r) => r.status === 'GENERATED',
          ).length;
        },
      });
    });
  }
  onAllReport() {
    this.router.navigate(['/screens/all-monthly-report']);
  }
}
