import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message';

@Injectable({
  providedIn: 'root'
})
export class WelcomeMessageApiService {
  constructor(private httpClient: HttpClient) {}

  getWelcomeMessageEditor(): Observable<WelcomeMessage> {
    const url = environment.appDataApiUrl + '/WelcomeMessages/editor';
    return this.httpClient.get<WelcomeMessage>(url);
  }

  updateWelcomeMessageEditor(content: string): Observable<WelcomeMessage> {
    const url = environment.appDataApiUrl + '/WelcomeMessages/editor';
    const jsonContent = JSON.stringify(content);
    return this.httpClient.put<WelcomeMessage>(url, jsonContent);
  }

  getWelcomeMessageDataMarketplace(): Observable<any> {
    const url = environment.appDataApiUrl + '/WelcomeMessages/dataMarketplace';
    return this.httpClient.get<any>(url);
  }

  updateWelcomeMessageDataMarketplace(
    content: string
  ): Observable<WelcomeMessage> {
    const url = environment.appDataApiUrl + '/WelcomeMessages/dataMarketplace';
    const jsonContent = JSON.stringify(content);
    return this.httpClient.put<WelcomeMessage>(url, jsonContent);
  }
}
