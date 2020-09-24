import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  private readonly baseUrl = environment.dmpCoreApiUrl;

  constructor(private httpClient: HttpClient) { }

  getMetadata(): Observable<any> {
    //return this.getMockData("./assets/mockdata/api_metadata_mock.json");
    return this.httpClient.get<any>(this.baseUrl + 'metadata');
  }

  getMetadataTypes(): Observable<any> {
    //return this.getMockData("./assets/mockdata/api_metadata_types_mock.json");
    return this.httpClient.get<any>(this.baseUrl + 'metadata/types');
  }

  getMockData(filename: string): Observable<any> {
    return this.httpClient.get<any>(filename);
  }
}
