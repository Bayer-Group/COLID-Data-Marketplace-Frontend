import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageDto } from 'src/app/shared/models/user/message-dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private httpClient: HttpClient) {}

  getUserNotifications(id: string): Observable<MessageDto[]> {
    const url = `${environment.appDataApiUrl}/Users/${id}/messages`;
    return this.httpClient.get<MessageDto[]>(url);
  }

  deleteNotification(userId: string, id: string): Observable<MessageDto> {
    const url = `${environment.appDataApiUrl}/Users/${userId}/messages/${id}`;
    return this.httpClient.delete<MessageDto>(url);
  }

  readNotification(userId: string, id: string): Observable<MessageDto> {
    const url = `${environment.appDataApiUrl}/Users/${userId}/messages/${id}/markRead`;
    return this.httpClient.put<MessageDto>(url, null);
  }

  readNotifications(userId: string, ids: string[]): Observable<MessageDto[]> {
    const url = `${environment.appDataApiUrl}/Users/${userId}/messages/markRead`;
    return this.httpClient.put<MessageDto[]>(url, ids);
  }
}
