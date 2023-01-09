import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsumerGroupResultDTO } from 'src/app/shared/models/consumerGroups/ConsumerGroupResultDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsumerGroupApiService {

  private controllerRouteSingle = 'consumerGroup';
  private controllerRoutePlural = 'consumerGroupList';

  constructor(private http: HttpClient) { }

  getActiveEntities(): Observable<ConsumerGroupResultDTO[]> {
    const url = `${environment.colidApiUrl}/${this.controllerRoutePlural}/active`;
    return this.http.get<ConsumerGroupResultDTO[]>(url);
  }
}
