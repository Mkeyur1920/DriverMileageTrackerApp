import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MileageRecordDTO } from '../../dto/mileageRecord.dto';
import { environment } from '../../../environments/environment';
import { MonthlyReportDTO } from '../../dto/monthlyReport.dto';

@Injectable({
  providedIn: 'root',
})
export class MonthlyReportService {
  private readonly API_URL = `${environment.apiBaseUrl}/monthly-reports`;

  constructor(private http: HttpClient) {}

  generateMonthlyReport(
    userId: number,
    month: number,
    year: number,
  ): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/create`, {
      params: {
        userId: userId,
        month: month,
        year: year,
      },
    });
  }

  getPendingReports(): Observable<MonthlyReportDTO[]> {
    return this.http.get<MonthlyReportDTO[]>(`${this.API_URL}/pending`);
  }

  getAllReports(): Observable<MonthlyReportDTO[]> {
    return this.http.get<MonthlyReportDTO[]>(`${this.API_URL}/all`);
  }

  updateReportStatus(
    reportId: number,
    status: string,
  ): Observable<MonthlyReportDTO> {
    return this.http.put<MonthlyReportDTO>(
      `${this.API_URL}/${reportId}/status`,
      null,
      { params: { status } },
    );
  }

  doesMonthlyReportExist(userId: string): Observable<MonthlyReportDTO[]> {
    return this.http.get<MonthlyReportDTO[]>(
      `${this.API_URL}/exists?userId=${userId}`,
    );
  }
}
