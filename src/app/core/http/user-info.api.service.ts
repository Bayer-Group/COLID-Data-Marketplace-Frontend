import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from 'src/app/shared/models/user/user-dto';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { SearchFilterDataMarketplaceDto } from 'src/app/shared/models/user/search-filter-data-marketplace-dto';
import { MessageConfigDto } from 'src/app/shared/models/user/message-config-dto';
import { StoredQueryDto } from 'src/app/shared/models/user/stored-query-dto';
import { HierarchicalData } from 'src/app/shared/models/user/hierarchical-dto';
import { ColidEntrySubscriptionDetailsDto } from 'src/app/shared/models/user/colid-entry-subscription-details-dto';

@Injectable({
  providedIn: 'root'
})
export class UserInfoApiService {
  constructor(private httpClient: HttpClient) {}

  createUser(id: string, emailAddress: string): Observable<UserDto> {
    const url = `${environment.appDataApiUrl}/Users/`;
    return this.httpClient.post<UserDto>(url, new UserDto(id, emailAddress));
  }

  getUser(id: string): Observable<UserDto> {
    const url = `${environment.appDataApiUrl}/Users/${id}`;
    return this.httpClient.get<UserDto>(url);
  }

  getUsers(): Observable<UserDto[]> {
    const url = `${environment.appDataApiUrl}/Users`;
    return this.httpClient.get<UserDto[]>(url);
  }

  setLastLoginDataMarketplace(id: string, date: Date) {
    const url = `${environment.appDataApiUrl}/Users/${id}/lastLoginDataMarketplace`;
    return this.httpClient.put<UserDto>(url, date);
  }

  setUserInformationFlag(id: string, setFlag: boolean) {
    const url = `${environment.appDataApiUrl}/Users/${id}/userInformationFlag`;
    return this.httpClient.put<UserDto>(url, setFlag);
  }

  addColidEntrySubscription(
    id: string,
    colidEntrySubscriptionDto: ColidEntrySubscriptionDto
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/colidEntrySubscriptions`;
    return this.httpClient.put(url, colidEntrySubscriptionDto);
  }

  removeColidEntrySubscription(
    id: string,
    colidEntrySubscriptionDto: ColidEntrySubscriptionDto
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/colidEntrySubscriptions`;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: colidEntrySubscriptionDto
    };

    return this.httpClient.delete(url, httpOptions);
  }

  addSearchFilterDataMarketplace(
    id: string,
    searchFilterDataMarketplaceDto: SearchFilterDataMarketplaceDto
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/searchFiltersDataMarketplace`;
    return this.httpClient.put(url, searchFilterDataMarketplaceDto);
  }

  setDefaultSearchFilterDataMarketplace(
    id: string,
    searchFilterDataMarketplaceId: number
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/defaultSearchFilterDataMarketplace/${searchFilterDataMarketplaceId}`;
    return this.httpClient.put(url, null);
  }

  setMessageConfig(
    id: string,
    messageConfigDto: MessageConfigDto
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/messageconfig`;
    return this.httpClient.put(url, messageConfigDto);
  }

  removeSearchFilterDataMarketplace(
    id: string,
    searchFilterDataMarketplaceId: number
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/searchFiltersDataMarketplace/${searchFilterDataMarketplaceId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: null
    };
    return this.httpClient.delete(url, httpOptions);
  }

  getStoredQueryDataMarketplace(id: string): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/subscribedSearchFiltersDataMarketplace`;
    return this.httpClient.get<SearchFilterDataMarketplaceDto[]>(url);
  }

  getSearchFiltersDataMarketplace(id: string): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/searchFiltersDataMarketplace`;
    return this.httpClient.get<SearchFilterDataMarketplaceDto[]>(url);
  }

  getAllStoredQueryDataMarketplace(): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/allSubscribedSearchFiltersDataMarketplace`;
    return this.httpClient.get<SearchFilterDataMarketplaceDto[]>(url);
  }

  getLatestSubscriptions(
    id: string
  ): Observable<ColidEntrySubscriptionDetailsDto[]> {
    const url = `${environment.appDataApiUrl}/Users/${id}/latestSubscriptionsWithDetails`;
    return this.httpClient.get<ColidEntrySubscriptionDetailsDto[]>(url);
  }

  getMostSubscribedResources(): Observable<ColidEntrySubscriptionDetailsDto[]> {
    const url = `${environment.appDataApiUrl}/Users/mostSubscribedResourceDetails`;
    return this.httpClient.get<ColidEntrySubscriptionDetailsDto[]>(url);
  }

  addStoredQueryDataMarketplace(
    id: string,
    storedQueryDto: StoredQueryDto
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/subscribeToSearchFilterDataMarketplace`;
    return this.httpClient.put(url, storedQueryDto);
  }

  removeStoredQueryDataMarketplace(
    id: string,
    searchFilterDataMarketplaceId: number
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/removeSubscriptionFromSearchFilterDataMarketplace/${searchFilterDataMarketplaceId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: null
    };
    return this.httpClient.delete(url, httpOptions);
  }

  getUserDepartmentsFlowView(): Observable<HierarchicalData> {
    const url = `${environment.dmpCoreApiUrl}User/userDepartmentsFlowView`;
    return this.httpClient.get<HierarchicalData>(url);
  }
}
