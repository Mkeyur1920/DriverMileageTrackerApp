import { Component, OnInit } from '@angular/core';
import { MonthlyReportService } from '../../service/monthly-report.service';
import { MessageService } from 'primeng/api';
import { MonthlyReportDTO } from '../../../dto/monthlyReport.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-report-review',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './report-review.component.html',
  styleUrl: './report-review.component.scss',
})
export class ReportReviewComponent implements OnInit {
  allReports: MonthlyReportDTO[] = [];
  filteredReports: MonthlyReportDTO[] = [];

  selectedStatus: string | null = null;
  globalFilterValue: string = '';

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Generated', value: 'GENERATED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  constructor(
    private monthlyReportService: MonthlyReportService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadAllReports();
  }

  loadAllReports(): void {
    this.monthlyReportService.getAllReports().subscribe((data) => {
      this.allReports = data;
      this.filterReports();
    });
  }

  filterReports(): void {
    const keyword = this.globalFilterValue.trim().toLowerCase();

    this.filteredReports = this.allReports.filter((report) => {
      const matchesStatus =
        !this.selectedStatus || report.status === this.selectedStatus;

      const matchesKeyword =
        report.user?.name?.toLowerCase().includes(keyword) ||
        report.user?.vehicleNumber?.toLowerCase().includes(keyword) ||
        report.month?.toLowerCase().includes(keyword) ||
        report.totalKm.toString().includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  markAsReject(reportId: number): void {
    this.monthlyReportService
      .updateReportStatus(reportId, 'REJECTED')
      .subscribe({
        next: (updated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Report for ${updated.month} marked as Rejected.`,
          });
          this.loadAllReports(); // refresh updated data
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update report status.',
          }),
      });
  }

  markAsGenerated(reportId: number): void {
    this.monthlyReportService
      .updateReportStatus(reportId, 'GENERATED')
      .subscribe({
        next: (updated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Report for ${updated.month} marked as GENERATED.`,
          });
          this.loadAllReports(); // refresh updated data
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update report status.',
          }),
      });
  }
}
