import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MileageRecordDTO } from '../../dto/mileageRecord.dto';
import { environment } from '../../../environments/environment';

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
}
