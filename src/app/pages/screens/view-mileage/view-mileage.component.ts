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

@Component({
  selector: 'app-view-mileage',
  standalone: true,
  imports: [
    TableModule,
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
  ],
  templateUrl: './view-mileage.component.html',
  styleUrl: './view-mileage.component.scss',
})
export class ViewMileageComponent {
  records: MileageRecordDTO[] = [];
  filteredRecords: MileageRecordDTO[] = [];
  newestId: number | null = null;

  selectedMonthYear: any = null;

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

  // yearOptions = [
  //   { name: '2023', value: 2023 },
  //   { name: '2024', value: 2024 },
  //   { name: '2025', value: 2025 },
  // ];

  constructor(
    private mileageService: MileageRecordService,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    this.loadRecords();
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
}
