import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceRetentionClasses } from 'src/app/shared/models/resourcePolicies/resource-retentionClass';
import { policyRequest } from 'src/app/shared/models/resourcePolicies/policy-request';

@Injectable({
  providedIn: 'root'
})
export class IronMountainService {
  constructor(private httpClient: HttpClient) { }

  getIronMountainResourcePolicies(policyRequestValues: policyRequest[] ): Observable<ResourceRetentionClasses[]> {
   /* const url = `${environment.colidApiUrl}/resourcepolicies`;
    var resourcePolicies =this.httpClient.post<ResourceRetentionClasses[]>(url, policyRequestValues); 
    return resourcePolicies*/
    return null
  }
}