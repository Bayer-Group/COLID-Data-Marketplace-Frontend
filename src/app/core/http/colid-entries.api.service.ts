import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';

@Injectable({
  providedIn: 'root'
})
export class ColidEntryApiService {
  constructor(private httpClient: HttpClient) { }

  getColidEntrySubscriptionCount(id: string[]): Observable<ColidEntrySubscriptionDto[]> {
    const url = `${environment.appDataApiUrl}/ColidEntries/subscriptions`;
    var subcriptionCounts =this.httpClient.post<ColidEntrySubscriptionDto[]>(url, id); 
    return subcriptionCounts
  }
}