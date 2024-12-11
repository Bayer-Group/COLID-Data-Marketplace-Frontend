import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { FilterGroupingOrderRaw } from 'src/app/shared/models/metadata/filter-grouping-order-raw';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private readonly baseUrl = environment.dmpCoreApiUrl;

  constructor(private httpClient: HttpClient) {}

  getMetadata(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + 'metadata');
  }

  getMetaData(resourceType: string): Observable<MetaDataProperty[]> {
    const url = environment.colidApiUrl + '/metadata';

    let params = new HttpParams();
    params = params.set('entityType', resourceType);
    return this.httpClient.get<MetaDataProperty[]>(url, { params });
  }

  getEntityMetadata(resourceType: string): Observable<MetaDataProperty[]> {
    const url = `${environment.colidApiUrl}/metadata`;
    const params = new HttpParams().set('entityType', resourceType);
    return this.httpClient.get<MetaDataProperty[]>(url, { params });
  }

  getLinkTypes() {
    const url = `${environment.colidApiUrl}/metadata/linkTypes`;
    return this.httpClient.get(url).pipe(
      map((res) => {
        const linkTypes = [];
        for (const [key, value] of Object.entries(res)) {
          linkTypes.push({ key, value });
        }
        return linkTypes;
      })
    );
  }

  getFilterGroups() {
    const url = `${environment.dmpCoreApiUrl}Search/filterGroup`;
    return this.httpClient.get<FilterGroupingOrderRaw[]>(url);
  }
}
