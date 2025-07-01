import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MileageRecordDTO } from '../../dto/mileageRecord.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MileageRecordService {
  private readonly API_URL = `${environment.apiBaseUrl}/mileage-records`;

  constructor(private http: HttpClient) {}

  getTotalKilometer(userId: number): Observable<number> {
    return this.http
      .get<number>(`${this.API_URL}/get-total-km/${userId}`, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<number>) => {
          if (res.status === 200) {
            // fallback to 0 if body is null
            return res.body ?? 0;
          }
          throw new Error('Failed to fetch total kilometers');
        }),
      );
  }

  saveMileageRecord(
    startKm: any,
    endKm: any,
    totalKm: any,
    placesVisited: any,
    userId: any,
  ): Observable<boolean> {
    return this.http
      .post<MileageRecordDTO>(
        `${this.API_URL}/save`,
        { startKm, endKm, totalKm, placesVisited, userId },
        { observe: 'response' },
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200 && res.body?.token) {
            //TO DO message service
            return true;
          }
          return false;
        }),
      );
  }
  getListOfMileageRecords(userId: number): Observable<MileageRecordDTO[]> {
    return this.http.get<MileageRecordDTO[]>(`${this.API_URL}/user/${userId}`);
  }
  getAll(): Observable<MileageRecordDTO[]> {
    return this.http.get<MileageRecordDTO[]>(`${this.API_URL}/all`);
  }
}
