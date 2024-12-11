import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StatusBuildInformationDto } from '../../shared/models/status/status-build-information-dto';
import { environment } from 'src/environments/environment';
import { RawDeploymentInformationDto } from 'src/app/shared/models/status/raw-deployment-information-dto';

@Injectable({
  providedIn: 'root'
})
export class StatusApiService {
  constructor(private httpClient: HttpClient) {}

  getReleaseNotes(): Observable<string> {
    const url = environment.releaseNotesUrl;

    return this.httpClient.get(url, { responseType: 'text' });
  }

  getBuildInformation(): Observable<StatusBuildInformationDto> {
    const url = environment.deploymentInfoUrl;

    return this.httpClient.get<RawDeploymentInformationDto>(url).pipe(
      map((res: RawDeploymentInformationDto) => {
        let dmpInformation = res.services['dmp-ui'];
        return {
          versionNumber: res.version,
          imageTags: dmpInformation.image_tags,
          latestReleaseDate: new Date(
            dmpInformation.image_pushed_at_epoch_utc_seconds * 1000
          )
        } as StatusBuildInformationDto;
      })
    );
  }
}
