import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExtendedUriTemplateResultDTO } from '../../shared/models/extendedUriTemplates/extended-uri-template-result-dto';
import { ExtendedUriTemplateRequestDTO } from '../../shared/models/extendedUriTemplates/extended-uri-template-request-dto';
import { ExtendedUriTemplateWriteResultCTO } from '../../shared/models/extendedUriTemplates/extended-uri-template-write-result-cto';
import { EntityBaseApiService } from './entity.base.api.service';

@Injectable({
  providedIn: 'root'
})
export class ExtendedUriTemplateApiService extends EntityBaseApiService<
  ExtendedUriTemplateRequestDTO,
  ExtendedUriTemplateResultDTO,
  ExtendedUriTemplateWriteResultCTO
> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'extendedUriTemplate', 'extendedUriTemplateList');
  }
}
