import { State, Action, StateContext, Selector } from '@ngxs/store';
import { mergeMap, tap } from 'rxjs/operators';
import { MetaDataProperty } from '../shared/models/metadata/meta-data-property';
import { ExtendedUriTemplateResultDTO } from '../shared/models/extendedUriTemplates/extended-uri-template-result-dto';
import { ExtendedUriTemplateApiService } from '../core/http/extended-uri-template-api.service';
import { ExtendedUriTemplateRequestDTO } from '../shared/models/extendedUriTemplates/extended-uri-template-request-dto';
import { MetadataService } from '../core/http/metadata.service';
import { Constants } from '../shared/constants';
import { Injectable } from '@angular/core';

export class FetchExtendedUriTemplates {
  static readonly type = '[ExtendedUriTemplate] Fetch extendedUriTemplates';
  constructor() {}
}

export class FetchExtendedUriTemplateDetails {
  static readonly type = '[ExtendedUriTemplate] Fetch extendedUriTemplate';
  constructor(public payload: string) {}
}

export class FetchExtendedUriTemplateMetadata {
  static readonly type =
    '[ExtendedUriTemplate] Fetch extendedUriTemplateMetadata';
  constructor() {}
}

export class CreateExtendedUriTemplate {
  static readonly type = '[ExtendedUriTemplate] Create ExtendedUriTemplate';
  constructor(public payload: ExtendedUriTemplateRequestDTO) {}
}

export class EditExtendedUriTemplate {
  static readonly type = '[ExtendedUriTemplate] Edit ExtendedUriTemplate';
  constructor(
    public id: string,
    public payload: ExtendedUriTemplateRequestDTO
  ) {}
}

export class DeleteExtendedUriTemplate {
  static readonly type = '[ExtendedUriTemplate] Delete extendedUriTemplate';
  constructor(public payload: string) {}
}

export class ClearExtendedUriTemplate {
  static readonly type = '[ExtendedUriTemplate] Clear extendedUriTemplate';
}

export class ExtendedUriTemplateStateModel {
  extendedUriTemplates: ExtendedUriTemplateResultDTO[];
  extendedUriTemplate: ExtendedUriTemplateResultDTO;
  metadata: MetaDataProperty[];
}

@State<ExtendedUriTemplateStateModel>({
  name: 'extendedUriTemplates',
  defaults: {
    extendedUriTemplates: null,
    extendedUriTemplate: null,
    metadata: null
  }
})
@Injectable()
export class ExtendedUriTemplateState {
  constructor(
    private extendedUriTemplateApiService: ExtendedUriTemplateApiService,
    private metadataService: MetadataService
  ) {}

  @Selector()
  public static getExtendedUriTemplates(state: ExtendedUriTemplateStateModel) {
    return state.extendedUriTemplates;
  }

  @Selector()
  public static getExtendedUriTemplate(state: ExtendedUriTemplateStateModel) {
    return state.extendedUriTemplate;
  }

  @Selector()
  public static getExtendedUriTemplateMetadata(
    state: ExtendedUriTemplateStateModel
  ) {
    return state.metadata;
  }

  @Action(FetchExtendedUriTemplates)
  fetchExtendedUriTemplates(
    { patchState }: StateContext<ExtendedUriTemplateStateModel>,
    {}: FetchExtendedUriTemplates
  ) {
    return this.extendedUriTemplateApiService.getAllEntities().pipe(
      tap((res) => {
        patchState({
          extendedUriTemplates: res
        });
      })
    );
  }

  @Action(FetchExtendedUriTemplateMetadata)
  fetchExtendedUriTemplateMetadata(
    { getState, patchState }: StateContext<ExtendedUriTemplateStateModel>,
    {}: FetchExtendedUriTemplateMetadata
  ) {
    if (getState().metadata != null) {
      return;
    }

    return this.metadataService
      .getMetaData(Constants.ResourceTypes.ExtendedUriTemplate)
      .pipe(
        tap((res) => {
          patchState({
            metadata: res
          });
        })
      );
  }

  @Action(CreateExtendedUriTemplate)
  createExtendedUriTemplate(
    { dispatch }: StateContext<ExtendedUriTemplateStateModel>,
    { payload }: CreateExtendedUriTemplate
  ) {
    return this.extendedUriTemplateApiService
      .createEntity(payload)
      .pipe(mergeMap(() => dispatch(new FetchExtendedUriTemplates())));
  }

  @Action(DeleteExtendedUriTemplate)
  deleteExtendedUriTemplate(
    { dispatch }: StateContext<ExtendedUriTemplateStateModel>,
    { payload }: DeleteExtendedUriTemplate
  ) {
    return this.extendedUriTemplateApiService
      .deleteEntity(payload)
      .pipe(mergeMap(() => dispatch(new FetchExtendedUriTemplates())));
  }

  @Action(EditExtendedUriTemplate)
  editExtendedUriTemplate(
    { dispatch }: StateContext<ExtendedUriTemplateStateModel>,
    { id, payload }: EditExtendedUriTemplate
  ) {
    return this.extendedUriTemplateApiService
      .editEntity(id, payload)
      .pipe(mergeMap(() => dispatch(new FetchExtendedUriTemplates())));
  }

  @Action(FetchExtendedUriTemplateDetails)
  fetchExtendedUriTemplateDetails(
    { patchState }: StateContext<ExtendedUriTemplateStateModel>,
    { payload }: FetchExtendedUriTemplateDetails
  ) {
    return this.extendedUriTemplateApiService.getEntityById(payload).pipe(
      tap((res) => {
        patchState({
          extendedUriTemplate: res
        });
      })
    );
  }

  @Action(ClearExtendedUriTemplate)
  clearExtendedUriTemplate(
    { patchState }: StateContext<ExtendedUriTemplateStateModel>,
    {}: ClearExtendedUriTemplate
  ) {
    patchState({
      extendedUriTemplate: null
    });
  }
}
