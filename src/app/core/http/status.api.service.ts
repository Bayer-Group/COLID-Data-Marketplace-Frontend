import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusBuildInformationDto } from '../../shared/models/status/status-build-information-dto';

@Injectable({
  providedIn: 'root'
})
export class StatusApiService {

  constructor(private httpClient: HttpClient) { }

  getBuildInformation(): Observable<StatusBuildInformationDto> {
    const url = environment.dmpCoreApiUrl + 'status';

    return this.httpClient.get<StatusBuildInformationDto>(url);
  }
}
