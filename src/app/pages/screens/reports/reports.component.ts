import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MileageRecordService } from '../../service/mileage-records.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { UserService } from '../../service/user.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, TableModule,
    ButtonModule,FormsModule,DropdownModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit{

  allData: any[] = [];
  groupedData: { [key: string]: any[] } = {};

  users: { id: number, name: string }[] = []; // dropdown list of users
  selectedUserId: number | null = null;

  availableYears: string[] = [];
  selectedYear: string = '';
    selectedRole: string = ''; // or default as 'ADMIN' or 'DRIVER'
  

  constructor(private route: ActivatedRoute,private userService : UserService,
    private mileageService: MileageRecordService){}
  ngOnInit(): void {
    // this.userId = this.route.snapshot.paramMap.get('userId'); 
    this.mileageService.getAll().subscribe((data: any[]) => {
      this.allData = data;
      this.extractAvailableUsers();
      this.extractAvailableYears();
    });

  }
  onChangeYear(){
    this.filteredData
  }
  onChangeUser(){
    this.filteredData
  }
  extractAvailableUsers() {
    const map = new Map<number, string>();

    this.allData.forEach(r => {
      const isAdminRole = r.user?.roles?.some((role: any) => role.roleName === 'ADMIN');
      if (!map.has(r.userId) && !isAdminRole) {
        map.set(r.user.id, `${r.user.name} #${r.user.vehicleNumber}`);
      }
    });
    this.users = Array.from(map, ([id, name]) => ({ id, name }));
  }

  extractAvailableYears() {
    const yearsSet = new Set<string>();
    this.allData.forEach(r => {
      const year = new Date(r.date).getFullYear().toString();
      yearsSet.add(year);
    });
    this.availableYears = Array.from(yearsSet).sort();
    if (this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[this.availableYears.length - 1]; // latest
    }
  }
   get filteredData(): any[] {
    if (!this.selectedUserId || !this.selectedYear) return [];

    return this.allData.filter(r => 
      r.userId === this.selectedUserId && 
      new Date(r.date).getFullYear().toString() === this.selectedYear
    );
  }

  get groupedFilteredData() {
    const grouped: { [key: string]: any[] } = {};
    this.filteredData.forEach(record => {
      const month = new Date(record.date).toISOString().substring(0, 7); // YYYY-MM
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(record);
    });
    return Object.entries(grouped).map(([key, value]) => ({ key, value }));
  }
  getTotalKm(month: string): number {
    return this.filteredData
      .filter(r => month === new Date(r.date).toISOString().substring(0, 7))
      .reduce((sum, r) => sum + (r.endKm - r.startKm), 0);
  }
  downloadPDF(month: string): void {
  const records = this.filteredData.filter(r =>
    new Date(r.date).toISOString().substring(0, 7) === month
  );



 if (records.length === 0) return;

  const firstRecord = records[0];
  const driverName = firstRecord?.user?.name ?? '';
  const vehicleNumber = firstRecord?.user?.vehicleNumber ?? '';
  const phoneNumber = firstRecord?.user?.phoneNumber ?? '';

  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text(`Mileage Report - ${month}`, 14, 10);
  doc.setFontSize(10);
  doc.text(`Driver: ${driverName}`, 14, 15);
  doc.text(`Vehicle No: ${vehicleNumber}`, 14, 20);
  doc.text(`Phone Number: ${phoneNumber}`, 14,25);

  const tableData = records.map((r, i) => [
    i + 1,
    new Date(r.date).toLocaleDateString('en-IN'), // Format date
    r.startKm,
    r.endKm,
    r.endKm - r.startKm,
    r.placesVisited
  ]);

  autoTable(doc, {
    startY: 27,
    head: [['#', 'Date', 'Start KM', 'End KM', 'Total KM', 'Visited Places']],
    body: tableData
  });

  doc.save(`Mileage_Report_${month}.pdf`);
}

}
