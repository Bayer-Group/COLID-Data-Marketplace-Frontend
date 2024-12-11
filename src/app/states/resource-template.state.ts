import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { mergeMap, tap } from 'rxjs/operators';
import { MetaDataProperty } from '../shared/models/metadata/meta-data-property';
import { Constants } from '../shared/constants';
import { ResourceTemplateApiService } from '../core/http/resource-template.api.service';
import { MetadataService } from '../core/http/metadata.service';
import { ResourceTemplateRequestDTO } from '../shared/models/resource-templates/resource-template-request-dto';
import { ResourceTemplateResultDTO } from '../shared/models/resource-templates/resource-template-result-dto';

export class FetchResourceTemplates {
  static readonly type = '[ResourceTemplate] Fetch ResourceTemplates';
  constructor() {}
}

export class FetchResourceTemplateMetadata {
  static readonly type = '[ResourceTemplate] Fetch ResourceTemplateMetadata';
  constructor() {}
}

export class CreateResourceTemplate {
  static readonly type = '[ResourceTemplate] Create ResourceTemplate';
  constructor(public payload: ResourceTemplateRequestDTO) {}
}

export class EditResourceTemplate {
  static readonly type = '[ResourceTemplate] Edit ResourcTemplate';
  constructor(
    public id: string,
    public payload: ResourceTemplateRequestDTO
  ) {}
}

export class DeleteResourceTemplate {
  static readonly type = '[ResourceTemplate] Delete ResourceTemplate';
  constructor(public payload: string) {}
}

export class ResourceTemplateStateModel {
  resourceTemplates: ResourceTemplateResultDTO[];
  resourceTemplate: ResourceTemplateResultDTO;
  metadata: MetaDataProperty[];
}

@State<ResourceTemplateStateModel>({
  name: 'resourceTemplates',
  defaults: {
    resourceTemplates: null,
    resourceTemplate: null,
    metadata: null
  }
})
@Injectable()
export class ResourceTemplateState {
  constructor(
    private resourceTemplateApiService: ResourceTemplateApiService,
    private metadataService: MetadataService
  ) {}

  @Selector()
  public static getResourceTemplates(state: ResourceTemplateStateModel) {
    return state.resourceTemplates;
  }

  @Selector()
  public static getResourceTemplate(state: ResourceTemplateStateModel) {
    return state.resourceTemplate;
  }

  @Selector()
  public static getResourceTemplatesMetadata(
    state: ResourceTemplateStateModel
  ) {
    return state.metadata;
  }

  @Action(FetchResourceTemplates)
  fetchResourceTemplates({
    patchState
  }: StateContext<ResourceTemplateStateModel>) {
    patchState({
      resourceTemplates: null
    });
    return this.resourceTemplateApiService.getAllEntities().pipe(
      tap((res) => {
        patchState({
          resourceTemplates: res
        });
      })
    );
  }

  @Action(FetchResourceTemplateMetadata)
  fetchResourceTemplateMetadata({
    getState,
    patchState
  }: StateContext<ResourceTemplateStateModel>) {
    if (getState().metadata != null) {
      return;
    }

    return this.metadataService
      .getMetaData(Constants.ResourceTemplates.Type)
      .pipe(
        tap((res) => {
          patchState({
            metadata: res
          });
        })
      );
  }

  @Action(CreateResourceTemplate)
  createResourceTemplate(
    { dispatch }: StateContext<ResourceTemplateStateModel>,
    { payload }: CreateResourceTemplate
  ) {
    return this.resourceTemplateApiService
      .createEntity(payload)
      .pipe(mergeMap(() => dispatch(new FetchResourceTemplates())));
  }

  @Action(EditResourceTemplate)
  editResourceTemplate(
    { dispatch }: StateContext<ResourceTemplateStateModel>,
    { id, payload }: EditResourceTemplate
  ) {
    return this.resourceTemplateApiService
      .editEntity(id, payload)
      .pipe(mergeMap(() => dispatch(new FetchResourceTemplates())));
  }

  @Action(DeleteResourceTemplate)
  deleteResourceTemplate(
    { dispatch }: StateContext<ResourceTemplateStateModel>,
    { payload }: DeleteResourceTemplate
  ) {
    return this.resourceTemplateApiService
      .deleteEntity(payload)
      .pipe(mergeMap(() => dispatch(new FetchResourceTemplates())));
  }
}
