import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MileageRecordService } from '../../service/mileage-records.service';
import { LoginService } from '../../service/login.service';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule],
  template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4"
              >Total Kilomters</span
            >
            <div
              class="text-surface-900 dark:text-surface-0 font-medium text-xl"
            >
              {{ totalKilometer }}
            </div>
          </div>
          <div
            class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-gauge text-blue-500 !text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">Revenue</span>
            <div
              class="text-surface-900 dark:text-surface-0 font-medium text-xl"
            >
              {{ totalRevenue }}
            </div>
          </div>
          <div
            class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-indian-rupee text-orange-500 !text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span>
            </div>
        </div> 
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Comments</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">85 </span>
                <span class="text-muted-color">responded</span>
            </div>
        </div>-->`,
})
export class StatsWidget implements OnInit {
  totalKilometer: number = 0;
  totalRevenue: number = 0;
  userId: any;

  constructor(
    private mileageService: MileageRecordService,
    private authService: LoginService,
  ) {}
  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userId = user.id;
    this.getTotalKilometer();
  }

  getTotalKilometer() {
    this.mileageService.getTotalKilometer(this.userId).subscribe({
      next: (res) => {
        this.totalKilometer = res; // Store in a component variable if needed
        this.totalRevenue = this.totalKilometer * 14.5;
      },
      error: (err) => {
        console.error('Error fetching total kilometers:', err);
        // Optionally show error message to user
      },
    });
  }
}
