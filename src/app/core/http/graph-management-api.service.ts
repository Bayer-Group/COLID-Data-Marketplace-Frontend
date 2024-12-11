import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GraphDto } from 'src/app/shared/models/graphs/graph-dto';
import { environment } from 'src/environments/environment';
import { NeptuneLoaderStatusReponse } from 'src/app/shared/models/graphs/neptune-loader-status-response';
import { NeptuneLoaderResponse } from 'src/app/shared/models/graphs/neptune-loader-response';

@Injectable({
  providedIn: 'root'
})
export class GraphManagementApiService {
  constructor(private httpClient: HttpClient) {}

  getGraphs(): Observable<GraphDto[]> {
    const url = environment.colidApiUrl + '/graph';
    return this.httpClient.get<GraphDto[]>(url);
  }

  getGraphUploadStatus(
    loaderId: string
  ): Observable<NeptuneLoaderStatusReponse> {
    const url = environment.colidApiUrl + '/graph/' + loaderId;
    return this.httpClient.get<NeptuneLoaderStatusReponse>(url);
  }

  deleteGraph(graph: string): Observable<any> {
    const url = environment.colidApiUrl + '/graph';
    let params = new HttpParams();
    params = params.append('graph', graph);
    return this.httpClient.delete<any>(url, { params });
  }

  downloadGraph(graph: string): any {
    const url = environment.colidApiUrl + '/graph/download';
    let params = new HttpParams();
    params = params.append('graph', graph);
    var data = this.httpClient.get(url, { responseType: 'blob', params });
    return data;
  }

  uploadGraph(
    file: any,
    graphName: string,
    overwriteExisting: string
  ): Observable<HttpEvent<NeptuneLoaderResponse>> {
    const url = environment.colidApiUrl + '/graph';

    let params = new HttpParams();
    params = params.append('graphName', graphName);
    params = params.append('overwriteExisting', overwriteExisting);

    const formData = new FormData();
    formData.append('turtleFile', file, file.name);

    // When uploading files, the content type must not be set at all,
    // so that the browser can choose the correct content type depending on the file type.
    let headers = new HttpHeaders({ 'x-skip-content-type': '' });

    return this.httpClient.post<NeptuneLoaderResponse>(url, formData, {
      reportProgress: true,
      observe: 'events',
      params: params,
      headers: headers
    });
  }
}
