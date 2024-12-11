import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsumerGroupRequestDTO } from 'src/app/shared/models/consumerGroups/consumer-group-request-dto';
import { ConsumerGroupResultDTO } from 'src/app/shared/models/consumerGroups/ConsumerGroupResultDTO';
import { ConsumerGroupWriteResultCTO } from 'src/app/shared/models/consumerGroups/consumer-group-write-result-cto';
import { environment } from 'src/environments/environment';
import { EntityBaseApiService } from './entity.base.api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsumerGroupApiService extends EntityBaseApiService<
  ConsumerGroupRequestDTO,
  ConsumerGroupResultDTO,
  ConsumerGroupWriteResultCTO
> {
  constructor(private http: HttpClient) {
    super(http, 'consumerGroup', 'consumerGroupList');
  }

  getActiveEntities(): Observable<ConsumerGroupResultDTO[]> {
    const url = `${environment.colidApiUrl}/${this.controllerRoutePlural}/active`;
    return this.http.get<ConsumerGroupResultDTO[]>(url);
  }

  reactivateConsumerGroup(identifier: string): Observable<any> {
    const url = `${environment.colidApiUrl}/${this.controllerRouteSingle}`;
    let params = new HttpParams();
    params = params.append('id', identifier);
    return this.httpClient.post(`${url}/reactivate`, null, { params });
  }
}
