import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReindexApiService {
  constructor(private httpClient: HttpClient) {}

  reindex(): Observable<any> {
    const url = environment.colidApiUrl + "/reindex/start";

    return this.httpClient.post(url, null);
  }
}
