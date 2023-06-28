import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ResourceOverviewCTO } from "src/app/shared/models/resources/resource-overview-cto";
import { Observable } from "rxjs";
import { ResourceSearchDTO } from "src/app/shared/models/resources/resource-search-dto";
import { CheckboxHierarchyDTO } from "src/app/shared/models/checkboxHierarchy-dto";
import { ResourceOverviewDTO } from "src/app/shared/models/resources/resource-overview-dto";
import { ResourceRevisionHistory } from "src/app/shared/models/resources/historic-resource-overview-dto";
import { Resource } from "src/app/shared/models/resources/resource";
import { LinkHistoryDto } from "src/app/shared/models/linkHistory/link-history-dto";
import { LinkHistorySearchBody } from "src/app/shared/models/linkHistory/link-history-search-body";

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
    return this.httpClient.get<CheckboxHierarchyDTO[]>(
      environment.colidApiUrl + "/metadata/hierarchyDmp"
    );
  }

  getDueReviews(
    consumerGroupId: string,
    endDate: string
  ): Observable<ResourceOverviewDTO[]> {
    const params = new HttpParams()
      .set("consumerGroup", encodeURI(consumerGroupId))
      .set("endDate", endDate);

    return this.httpClient.get<ResourceOverviewDTO[]>(
      environment.colidApiUrl + "/resource/dueReviews",
      {
        params: params,
      }
    );
  }

  confirmReview(pidUri: string): Observable<ResourceOverviewDTO> {
    const params = new HttpParams().set("pidUri", encodeURI(pidUri));

    return this.httpClient.put<ResourceOverviewDTO>(
      environment.colidApiUrl + "/resource/confirmReview",
      {},
      { params: params }
    );
  }

  getResourceRevisionHistory(
    resourcePidUri: string
  ): Observable<ResourceRevisionHistory[]> {
    const url = `${environment.colidApiUrl}/resource/resourcerevisionshistory`;
    let params = new HttpParams().set("pidUri", resourcePidUri);
    return this.httpClient.get<ResourceRevisionHistory[]>(url, { params });
  }

  getHistoricResource(id: string, pidUri: string): Observable<Resource> {
    const url = environment.colidApiUrl + "/resource/history";
    let params = new HttpParams();
    params = params.append("pidUri", pidUri);
    params = params.append("id", id);
    return this.httpClient.get<Resource>(url, { params });
  }

  getResourcesByPidUri(resourcePidUri: string): Observable<Resource> {
    const url = environment.colidApiUrl + "/resource";
    let params = new HttpParams();
    params = params.append("pidUri", resourcePidUri);
    return this.httpClient.get<Resource>(url, { params });
  }

  markResourceAsDeleted(
    resourcePidUri: string,
    requester: string
  ): Observable<any> {
    const url = environment.colidApiUrl + "/resource/markForDeletion";
    let params = new HttpParams();
    params = params.append("pidUri", resourcePidUri);
    params = params.append("requester", requester);

    return this.httpClient.put(url, null, { params });
  }

  deleteResources(
    resourcePidUris: string[],
    requester: string
  ): Observable<any> {
    const url = environment.colidApiUrl + "/resource/resourceList";
    let params = new HttpParams();
    params = params.append("requester", requester);

    return this.httpClient.put(url, resourcePidUris, { params });
  }

  rejectResourcesMarkedDeleted(resourcePidUris: string[]): Observable<any> {
    const url = environment.colidApiUrl + "/resource/resourceList/reject";
    return this.httpClient.put(url, resourcePidUris);
  }

  createLink(
    pidUri: string,
    linkType: string,
    pidUriToLink: string,
    requester: string
  ): Observable<Resource> {
    const url = environment.colidApiUrl + "/resource/addLink";
    let params = new HttpParams();
    params = params.append("pidUri", pidUri);
    params = params.append("linkType", linkType);
    params = params.append("pidUriToLink", pidUriToLink);
    params = params.append("requester", requester);
    return this.httpClient.post<Resource>(url, null, { params });
  }

  searchLinkHistory(
    searchBody: LinkHistorySearchBody
  ): Observable<LinkHistoryDto[]> {
    const url = `${environment.colidApiUrl}/resource/searchLinkHistory`;
    return this.httpClient.post<LinkHistoryDto[]>(url, searchBody);
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
