import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { MileageRecordService } from '../../service/mileage-records.service';
import { LoginService } from '../../service/login.service';
import { MileageRecordDTO } from '../../../dto/mileageRecord.dto';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MonthlyReportService } from '../../service/monthly-report.service';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { MonthlyReportDTO } from '../../../dto/monthlyReport.dto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../dto/user.dto';

@Component({
  selector: 'app-view-mileage',
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    SelectModule,
    SliderModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    ProgressBarModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: './view-mileage.component.html',
  styleUrl: './view-mileage.component.scss',
})
export class ViewMileageComponent {
  records: MileageRecordDTO[] = [];
  filteredRecords: MileageRecordDTO[] = [];
  newestId: number | null = null;
  showGenerateButton: boolean = false; //default value is false
  userId: any;
  isReportAvailable: boolean = false;
  userDto!: User;

  selectedMonthYear: any = null;
  monthlyReports: MonthlyReportDTO[] = [];

  monthOptions = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 },
  ];

  today: Date = new Date();
  currentYear: number = new Date().getFullYear();

  constructor(
    private http: HttpClient,
    private monthlyReportService: MonthlyReportService,
    private mileageService: MileageRecordService,
    private loginService: LoginService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loadRecords();
    this.userDto = this.loginService.getUser();
    this.userId = this.userDto.id;
    this.checkMonthlyReport(this.userId);
  }

  checkMonthlyReport(userId: string) {
    this.monthlyReportService
      .doesMonthlyReportExist(userId)
      .subscribe((reports: MonthlyReportDTO[]) => {
        if (reports.length > 0) {
          this.monthlyReports = reports;
          this.isReportAvailable = true;
          this.loadReports();
        }
      });
  }

  loadReports(): void {}

  getFormattedMonth(): string {
    if (!this.selectedMonthYear) return '';
    const month = this.selectedMonthYear.getMonth() + 1;
    const year = this.selectedMonthYear.getFullYear();
    return `${year}-${month < 10 ? '0' + month : month}`;
  }

  loadRecords() {
    const user: any = this.loginService.getUser();
    this.mileageService.getListOfMileageRecords(user.id).subscribe((data) => {
      this.records = data;
      this.filteredRecords = [...this.records];
      this.findNewest();
    });
  }

  refresh() {
    this.loadRecords();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  filterRecords() {
    if (!this.selectedMonthYear) {
      this.filteredRecords = [...this.records];
      return;
    }

    const selectedMonth = this.selectedMonthYear.getMonth();
    const selectedYear = this.selectedMonthYear.getFullYear();

    this.filteredRecords = this.records.filter((rec) => {
      const recDate = new Date(rec.date);
      return (
        recDate.getMonth() === selectedMonth &&
        recDate.getFullYear() === selectedYear
      );
    });
    const uniqueDays = new Set(
      this.filteredRecords.map((rec) => new Date(rec.date).getDate()),
    );

    this.showGenerateButton = uniqueDays.size > 0; //change to 25
  }

  findNewest() {
    if (this.records.length > 0) {
      this.newestId = this.records.reduce(
        (latest, curr) =>
          new Date(curr.date) >
          new Date(this.records.find((r) => r.id === latest)?.date || '')
            ? curr.id
            : latest,
        this.records[0].id,
      );
    }
  }

  getTotalKM(): number {
    return this.filteredRecords.reduce((sum, r) => sum + r.totalKm, 0);
  }

  generateMonthlyReport() {
    this.userId;
    const month = this.selectedMonthYear.getMonth() + 1;
    const year = this.selectedMonthYear.getFullYear();

    this.monthlyReportService
      .generateMonthlyReport(this.userId, month, year)
      .subscribe({
        next: (reportData) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Report status change to ${reportData.status} of ${reportData.month}`,
          });
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to generate report.',
          });
        },
      });
  }

  downloadReportByMonth(monthDate: Date) {
    const userId = this.userId;

    this.mileageService
      .getListOfMileageRecordsByMonthUserId(userId, monthDate)
      .subscribe({
        next: (records) => {
          if (records.length > 0) {
            this.generatePDF(records, monthDate);
          }
        },
        error: (error) => {
          console.error('Error fetching mileage records', error);
        },
      });
  }
  loadLogoBase64(): Promise<string> {
    return this.http
      .get('assets/fulllogo.jpg', { responseType: 'blob' })
      .toPromise()
      .then((blob: any) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }

  async generatePDF(records: any[], month: any) {
    const doc = new jsPDF();

    // 1. App Header
    const appName = 'Driver Mileage Tracker';

    const driverName = this.userDto.name;
    const vehicleNumber = this.userDto.vehicleNumber;

    const logoImgData = await this.loadLogoBase64();

    // Logo
    doc.addImage(logoImgData, 'PNG', 10, 10, 25, 25);

    // App Name and Driver Info
    doc.setFontSize(16);
    doc.text(appName, 40, 20);
    doc.setFontSize(12);
    doc.text(`Month: ${month}`, 40, 30);
    doc.text(`Driver Name: ${driverName}`, 40, 38);
    doc.text(`Vehicle Number: ${vehicleNumber}`, 40, 45);

    // 2. Mileage Table
    const tableData = records.map((r, index) => [
      index + 1,
      this.formatDate(r.date),
      r.startKm,
      r.endKm,
      r.totalKm,
      r.placesVisited,
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['#', 'Date', 'Start KM', 'End KM', 'Total KM', 'Places Visited']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
    });

    // 3. Footer with Signature Blocks
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(12);
    doc.text('Driver Signature', 20, pageHeight - 20);
    doc.text('Officer Signature', 140, pageHeight - 20);

    // Save PDF
    doc.save(`MileageReport-${month}.pdf`);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }
}
