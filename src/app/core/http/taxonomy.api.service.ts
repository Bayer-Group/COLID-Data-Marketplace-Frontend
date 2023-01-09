import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaxonomyDTO } from 'src/app/shared/models/taxonomy-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  constructor(private httpClient: HttpClient) { }

  getTaxonomyList(taxonomyType: string): Observable<TaxonomyDTO[]> {
    const url = `${environment.colidApiUrl}/taxonomyList`;
    let params = new HttpParams()
      .append('taxonomyType', taxonomyType);
    return this.httpClient.get<TaxonomyDTO[]>(url, { params });
  }
}
