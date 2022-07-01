import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SimilarityResult, Success } from 'src/app/shared/models/similarity-result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SimilarityService {

  baseUrl: string = `${environment.dmpCoreApiUrl}Search/similarity/`;


  constructor(private httpClient: HttpClient) { }
 
  loadSimilarityResource(pidUri: string): Observable<SimilarityResult>{
    const requestObject = {
      id: pidUri
    };

    return this.httpClient.post<SimilarityResult>(this.baseUrl + '?model=ft', requestObject);
  }

  loadSimilarityResourceByResource(pidResource: object): Observable<SimilarityResult>{
    return this.httpClient.post<SimilarityResult>(this.baseUrl + '?model=ft', pidResource);
  }

  loadNextSimilarityResource(pidUri: string, threshold: number): Observable<SimilarityResult>{
    const requestObject = {
      id: pidUri
    };

    return this.httpClient.post<SimilarityResult>(`${this.baseUrl}?model=ft&threshold=${threshold}`, requestObject);
  }

  loadNextSimilarityResourceByResource(pidResource: object, threshold: number): Observable<SimilarityResult>{
    return this.httpClient.post<SimilarityResult>(`${this.baseUrl}?model=ft&threshold=${threshold}`, pidResource);
  }
}
