import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';

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

  getEntityMetadata(resourceType: string): Observable<MetaDataProperty[]> {
    const url = `${environment.colidApiUrl}/metadata`;
    const params = new HttpParams()
      .set('entityType', resourceType);
    return this.httpClient.get<MetaDataProperty[]>(url, { params });
  }

  getMetadataTypes(): Observable<any> {
    //return this.getMockData("./assets/mockdata/api_metadata_types_mock.json");
    return this.httpClient.get<any>(this.baseUrl + 'metadata/types');
  }

  getMockData(filename: string): Observable<any> {
    return this.httpClient.get<any>(filename);
  }
}
