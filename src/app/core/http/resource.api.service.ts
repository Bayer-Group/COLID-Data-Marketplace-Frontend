import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ResourceOverviewCTO } from "src/app/shared/models/resources/resource-overview-cto";
import { Observable } from "rxjs";
import { ResourceSearchDTO } from "src/app/shared/models/resources/resource-search-dto";
import { CheckboxHierarchyDTO } from "src/app/shared/models/checkboxHierarchy-dto";

@Injectable({
  providedIn: "root",
})
export class ResourceApiService {
 
  constructor(private httpClient: HttpClient) {}

  getFilteredResources(
    resourceSearchObject: ResourceSearchDTO
  ): Observable<ResourceOverviewCTO> {
    const url = environment.colidApiUrl + "/resource/search";

    //const params = this.toHttpParams(resourceSearchObject);
    const params = this.removeNullProperties(resourceSearchObject);
    return this.httpClient.post<ResourceOverviewCTO>(
      url,
      JSON.stringify(params)
    );
  }

  getHierarchy(): Observable<CheckboxHierarchyDTO[]> {
    return this.httpClient.get<CheckboxHierarchyDTO[]>(environment.colidApiUrl + '/metadata/hierarchyDmp');
  }

  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj).reduce((p, key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((_value) => {
          p = p.append(key, _value);
        });
      } else {
        if (value != null) {
          p = p.set(key, value);
        }
      }
      return p;
    }, new HttpParams());
  }
  removeNullProperties(obj: object): object {
    const outParams = {};
    return Object.getOwnPropertyNames(obj).reduce((p, key) => {
      const value = obj[key];
      if (value == null || value == "") {
        outParams[key] = undefined;
      } else {
        outParams[key] = value;
      }
      return outParams;
    }, outParams);
  }
}
