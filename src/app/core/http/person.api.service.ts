import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { AdSearchResult } from "src/app/shared/models/activeDirectory/ad-search-result";

@Injectable({
  providedIn: "root",
})
export class PersonApiService {
  url = environment.appDataApiUrl + "/activeDirectory/usersAndGroups";

  constructor(private httpClient: HttpClient) {}

  searchPerson(searchTerm: string): Observable<AdSearchResult> {
    // To prevent a bad request in api service
    if (searchTerm == null || searchTerm === "") {
      return of(new AdSearchResult());
    }

    let params = new HttpParams();

    if (searchTerm != null) {
      params = params.append("q", searchTerm);
    }

    return this.httpClient.get<AdSearchResult>(this.url, { params });
  }
}
