import { Component, OnInit } from '@angular/core';
import { MileageRecordService } from '../../service/mileage-records.service';
import { UserService } from '../../service/user.service';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MonthlyReportService } from '../../service/monthly-report.service';
import { ChartModule } from 'primeng/chart';
import { async } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ButtonModule, ChartModule],
  template: `
    <!-- Dashboard Stats Cards -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
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

    <!-- Quick Access Button -->
    <hr class="my-6" />
    <div class="p-4 bg-surface-50 rounded shadow-sm mt-4">
      <h3 class="text-lg font-semibold mb-2">Quick Report Access</h3>
      <p-button
        (onClick)="onAllReport()"
        class="mr-2"
        label="View All Reports"
      ></p-button>
    </div>

    <!-- Charts Section -->
    <hr class="my-6" />
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      <!-- 1. Monthly Mileage Line Chart -->
      <div class="p-card p-4 shadow-md rounded bg-white">
        <h4 class="mb-3 text-lg font-semibold">Monthly KM Trend</h4>
        <p-chart
          type="line"
          [data]="monthlyLineChartData"
          [options]="lineOptions"
          styleClass="w-full h-64"
        ></p-chart>
      </div>

      <!-- 2. Submission Status Pie Chart -->
      <div class="p-card p-4 shadow-md rounded bg-white">
        <h4 class="mb-3 text-lg font-semibold">Submission Status</h4>
        <p-chart
          type="pie"
          [data]="submissionPieData"
          [options]="pieOptions"
          styleClass="w-full h-64"
        ></p-chart>
      </div>

      <!-- 3. Top Drivers Bar Chart -->
      <div class="p-card p-4 shadow-md rounded bg-white">
        <h4 class="mb-3 text-lg font-semibold">Top Drivers by KM</h4>
        <p-chart
          type="bar"
          [data]="topDriversBarData"
          [options]="barOptions"
          styleClass="w-full h-64"
        ></p-chart>
      </div>
    </div>
  `,
})
export class AdminDashboard implements OnInit {
  monthlyLineChartData: any;
  submissionPieData: any;
  topDriversBarData: any;

  mileageDataCharts: any;

  lineOptions: any;
  pieOptions: any;
  barOptions: any;

  totalDrivers = 0;
  totalMileageThisMonth = 0;
  totalKm = 0;
  pendingReports = 0;
  generatedReports = 0;
  rejectedReports = 0;

  constructor(
    private userService: UserService,
    private router: Router,

    private mileageService: MileageRecordService,
    private monthlyReportService: MonthlyReportService,
  ) {}

  ngOnInit(): void {
    this.submissionPieData = {
      labels: ['Pending', 'Generated', 'Rejected'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#f39c12', '#27ae60', '#e74c3c'],
        },
      ],
    };

    this.userService.getAll().subscribe((users) => {
      this.totalDrivers = users.filter((u: any) =>
        u.roles.some((r: any) => r.roleName !== 'ADMIN'),
      ).length;
    });

    this.mileageService.getAll().subscribe((records) => {
      this.mileageDataCharts = records;

      const currentMonth = new Date().toISOString().slice(0, 7);

      this.totalMileageThisMonth = records.filter((r) =>
        r.date.startsWith(currentMonth),
      ).length;

      this.totalKm = records.reduce((sum, r) => sum + (r.endKm - r.startKm), 0);

      this.getChartsDetails();

      // ✅ Update pie chart after fetching report stats
      this.monthlyReportService.getAllReports().subscribe({
        next: (res) => {
          this.pendingReports = res.filter(
            (r) => r.status === 'PENDING',
          ).length;
          this.generatedReports = res.filter(
            (r) => r.status === 'GENERATED',
          ).length;
          this.rejectedReports = res.filter(
            (r) => r.status === 'REJECTED',
          ).length;

          this.submissionPieData = {
            labels: ['Pending', 'Generated', 'Rejected'],
            datasets: [
              {
                data: [
                  this.pendingReports,
                  this.generatedReports,
                  this.rejectedReports,
                ],
                backgroundColor: ['#f39c12', '#27ae60', '#e74c3c'],
              },
            ],
          };
        },
      });
    });

    this.pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }

  getChartsDetails(): void {
    const monthMap: { [key: string]: number } = {};
    const driverMap: { [key: string]: number } = {};

    for (const r of this.mileageDataCharts) {
      const month = r.date.slice(0, 7); // e.g., '2025-07'
      const km = r.endKm - r.startKm;

      // Aggregate by month
      monthMap[month] = (monthMap[month] || 0) + km;

      // Use name + vehicle number to ensure unique key
      const driverKey = `${r.user.name} (${r.user.vehicleNumber})`;
      driverMap[driverKey] = (driverMap[driverKey] || 0) + km;
    }

    const sortedMonths = Object.keys(monthMap).sort();
    const sortedDrivers = Object.entries(driverMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.monthlyLineChartData = {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Total KM',
          data: sortedMonths.map((m) => monthMap[m]),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    };

    this.topDriversBarData = {
      labels: sortedDrivers.map((d) => d[0]),
      datasets: [
        {
          label: 'KM',
          backgroundColor: '#42A5F5',
          data: sortedDrivers.map((d) => d[1]),
        },
      ],
    };
  }

  onAllReport() {
    this.router.navigate(['/screens/all-monthly-report']);
  }
}
