import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationDto } from '../../dto/notification.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API_URL = `${environment.apiBaseUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.API_URL}/user/${userId}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${notificationId}/read`, {});
  }
}
