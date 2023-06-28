import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResourceRetentionClasses } from "src/app/shared/models/resourcePolicies/resource-retentionClass";

@Injectable({
  providedIn: "root",
})
export class IronMountainService {
  constructor(private httpClient: HttpClient) {}

  getIronMountainResourcePolicies(_): Observable<ResourceRetentionClasses[]> {
    /* const url = `${environment.colidApiUrl}/resourcepolicies`;
    var resourcePolicies =this.httpClient.post<ResourceRetentionClasses[]>(url, policyRequestValues); 
    return resourcePolicies*/
    return null;
  }
}
