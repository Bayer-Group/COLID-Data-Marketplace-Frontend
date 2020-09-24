import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from 'src/app/shared/models/user/user-dto';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { SearchFilterDataMarketplaceDto } from 'src/app/shared/models/user/search-filter-data-marketplace-dto';
import { MessageConfigDto } from 'src/app/shared/models/user/message-config-dto';

@Injectable({
  providedIn: 'root'
})
export class UserInfoApiService {

  constructor(private httpClient: HttpClient) { }

  createUser(id: string, emailAddress: string): Observable<UserDto> {
    const url = `${environment.appDataApiUrl}/Users/`;
    return this.httpClient.post<UserDto>(url, new UserDto(id, emailAddress));
  }

  getUser(id: string): Observable<UserDto> {
    const url = `${environment.appDataApiUrl}/Users/${id}`;
    return this.httpClient.get<UserDto>(url);
  }

  setLastLoginDataMarketplace(id: string, date: Date) {
    const url = `${environment.appDataApiUrl}/Users/${id}/lastLoginDataMarketplace`;
    return this.httpClient.put<UserDto>(url, date);
  }

  addColidEntrySubscription(id: string, colidEntrySubscriptionDto: ColidEntrySubscriptionDto): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/colidEntrySubscriptions`;
    return this.httpClient.put(url, colidEntrySubscriptionDto);
  }

  removeColidEntrySubscription(id: string, colidEntrySubscriptionDto: ColidEntrySubscriptionDto): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/colidEntrySubscriptions`;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: colidEntrySubscriptionDto
    };

    return this.httpClient.delete(url, httpOptions);
  }

  addSearchFilterDataMarketplace(id: string, searchFilterDataMarketplaceDto: SearchFilterDataMarketplaceDto): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/searchFiltersDataMarketplace`;
    return this.httpClient.put(url, searchFilterDataMarketplaceDto);
  }

  setDefaultSearchFilterDataMarketplace(id: string, searchFilterDataMarketplaceId: number): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/defaultSearchFilterDataMarketplace/${searchFilterDataMarketplaceId}`;
    return this.httpClient.put(url, null);
  }

  setMessageConfig(id: string, messageConfigDto: MessageConfigDto): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/messageconfig`;
    return this.httpClient.put(url, messageConfigDto);
  }
}
