import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  DocumentMap,
  DocumentMaps,
  SearchHit,
} from "src/app/shared/models/search-result";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  private readonly baseUrl = environment.dmpCoreApiUrl;

  constructor(private httpClient: HttpClient) {}

  getDocument(id: string): Observable<DocumentMap> {
    let params = new HttpParams().set("id", id);
    return this.httpClient.get<DocumentMap>(this.baseUrl + "document", {
      params: params,
    });
  }

  getDocuments(pidUris: string[]): Observable<SearchHit[]> {
    return this.httpClient
      .post<DocumentMaps>(this.baseUrl + "documentsByIds", pidUris)
      .pipe(
        map((documentMaps: DocumentMaps) => {
          return Object.entries(documentMaps).reduce((acc, [key, value]) => {
            const searchHit: SearchHit = {
              id: decodeURIComponent(key),
              source: value[0],
              highlight: null,
              score: 0,
            };
            acc.push(searchHit);
            return acc;
          }, []);
        })
      );
  }
}
