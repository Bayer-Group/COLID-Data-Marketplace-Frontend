import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PidUriTemplateResultDTO } from '../../shared/models/pidUriTemplates/pid-uri-template-result-dto';
import { PidUriTemplateRequestDTO } from '../../shared/models/pidUriTemplates/pid-uri-template-request-dto';
import { PidUriTemplateWriteResultCTO } from '../../shared/models/pidUriTemplates/pid-uri-template-write-result-cto';
import { EntityBaseApiService } from './entity.base.api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PidUriTemplateApiService extends EntityBaseApiService<
  PidUriTemplateRequestDTO,
  PidUriTemplateResultDTO,
  PidUriTemplateWriteResultCTO
> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'pidUriTemplate', 'pidUriTemplateList');
  }

  reactivatePidUriTemplate(identifier: string): Observable<any> {
    const url = `${environment.colidApiUrl}/${this.controllerRouteSingle}`;
    let params = new HttpParams();
    params = params.append('id', identifier);
    return this.httpClient.post(`${url}/reactivate`, null, { params });
  }
}
