import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class IdentifierApiService {
  constructor(private httpClient: HttpClient) {}

  getOrphanedIdentifiers(): Observable<string[]> {
    const url = environment.colidApiUrl + "/identifier/orphanedList";
    var resp = this.httpClient.get<string[]>(url);
    return resp;
  }

  deleteOrphanedIdentifier(identifierUri: string): Observable<any> {
    const url = environment.colidApiUrl + "/identifier/orphaned";
    let params = new HttpParams();
    params = params.append("uri", identifierUri);
    return this.httpClient.delete(url, { params });
  }
}
