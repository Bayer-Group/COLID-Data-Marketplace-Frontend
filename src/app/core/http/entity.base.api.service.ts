import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EntityBaseApiService<TRequest, TResult, TWriteResult> {
  constructor(
    protected httpClient: HttpClient,
    protected controllerRouteSingle,
    protected controllerRoutePlural
  ) {}

  getAllEntities(): Observable<Array<TResult>> {
    const url = `${environment.colidApiUrl}/${this.controllerRoutePlural}`;
    return this.httpClient.get<TResult[]>(url);
  }

  getEntityById(id: string): Observable<TResult> {
    const url = `${environment.colidApiUrl}/${this.controllerRouteSingle}`;
    let params = new HttpParams();
    params = params.append("id", id);
    return this.httpClient.get<TResult>(url, { params });
  }

  createEntity(entity: TRequest): Observable<TWriteResult> {
    const url = `${environment.colidApiUrl}/${this.controllerRouteSingle}`;
    return this.httpClient.post<TWriteResult>(url, entity);
  }

  editEntity(id: string, entity: TRequest): Observable<TWriteResult> {
    const url = `${environment.colidApiUrl}/${this.controllerRouteSingle}`;
    let params = new HttpParams();
    params = params.append("id", id);
    return this.httpClient.put<TWriteResult>(url, entity, { params });
  }

  deleteEntity(id: string): Observable<any> {
    const url = `${environment.colidApiUrl}/${this.controllerRouteSingle}`;
    let params = new HttpParams();
    params = params.append("id", id);
    return this.httpClient.delete(url, { params });
  }
}
