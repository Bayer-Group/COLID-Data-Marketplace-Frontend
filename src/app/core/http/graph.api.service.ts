import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { GraphResultDTO } from "src/app/shared/models/graphs/graph-result-dto";
import { GraphRequestDTO } from "src/app/shared/models/graphs/graph-request-dto";
import { GraphOverViewDto } from "src/app/shared/models/graphs/graph-overview-dto";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { GraphWriteResultCTO } from "src/app/shared/models/graphs/graph-write-result-cto";

@Injectable({
  providedIn: "root",
})
export class GraphApiService {
  url = environment.colidApiUrl + "/metadataGraphConfiguration";

  constructor(private httpClient: HttpClient) {}

  getHistory(): Observable<GraphOverViewDto[]> {
    return this.httpClient.get<GraphOverViewDto[]>(`${this.url}/history`);
  }

  getGraph(): Observable<GraphResultDTO> {
    return this.httpClient.get<GraphResultDTO>(this.url);
  }

  getHistoricGraph(id: string): Observable<GraphResultDTO> {
    let params = new HttpParams();
    params = params.append("id", id);
    return this.httpClient.get<GraphResultDTO>(this.url, { params });
  }

  createGraph(request: GraphRequestDTO): Observable<GraphWriteResultCTO> {
    return this.httpClient.post<GraphWriteResultCTO>(this.url, request);
  }
}
