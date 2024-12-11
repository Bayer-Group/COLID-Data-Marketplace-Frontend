import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GraphKeywordUsage } from 'src/app/shared/models/key-management/graph-keyword-usage-dto';
import { KeywordGraphUpdateDto } from 'src/app/shared/models/key-management/keyword-graph-update-dto';

@Injectable({
  providedIn: 'root'
})
export class KeywordManagementApiService {
  constructor(private httpClient: HttpClient) {}

  getKeywordGraphs(): Observable<string[]> {
    const url = `${environment.colidApiUrl}/graph/keywordGraphs`;
    return this.httpClient.get<string[]>(url);
  }

  getGraphTypeOfSelectedInstanceGraph(
    selectedGraph: string
  ): Observable<string[]> {
    const url = `${environment.colidApiUrl}/graph/graphType`;
    let params = new HttpParams({
      fromObject: { graph: selectedGraph }
    });
    return this.httpClient.get<string[]>(url, { params });
  }

  getKeywordGraphUsage(
    keywordGraphPidUri: string
  ): Observable<GraphKeywordUsage[]> {
    const url = `${environment.colidApiUrl}/graph/keywordUsageInGraph`;
    let params = new HttpParams({
      fromObject: { graph: keywordGraphPidUri }
    });
    return this.httpClient.get<GraphKeywordUsage[]>(url, { params });
  }

  modifyKeywordGraph(
    keywordGraphUpdate: KeywordGraphUpdateDto
  ): Observable<string> {
    const url = `${environment.colidApiUrl}/graph/modifyKeyWordGraph`;
    return this.httpClient.post<string>(url, keywordGraphUpdate);
  }
}
