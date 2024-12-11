import { Injectable } from '@angular/core';
import { EntityBaseApiService } from './entity.base.api.service';
import { ResourceTemplateRequestDTO } from 'src/app/shared/models/resource-templates/resource-template-request-dto';
import { ResourceTemplateResultDTO } from 'src/app/shared/models/resource-templates/resource-template-result-dto';
import { ResourceTemplateWriteResultCTO } from 'src/app/shared/models/resource-templates/resource-template-write-result-cto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResourceTemplateApiService extends EntityBaseApiService<
  ResourceTemplateRequestDTO,
  ResourceTemplateResultDTO,
  ResourceTemplateWriteResultCTO
> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'resourceTemplate', 'resourceTemplateList');
  }
}
