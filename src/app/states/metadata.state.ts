import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { MetadataService } from '../core/http/metadata.service';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';

import { Constants } from '../shared/constants';
import { CheckboxHierarchyDTO } from '../shared/models/checkboxHierarchy-dto';

export class FetchMetadata {
  static readonly type = '[Metadata] FetchMetadata';
}

export class FetchMetadataTypes {
  static readonly type = '[Metadata] FetchMetadataTypes';
}

export class FetchResourceTypeHierarchy {
  static readonly type = '[Metadata] FetchResourceTypeHierarchy';
}

export interface MetadataStateModel {
  metadata: any;
  types: any;
  hierarchy:CheckboxHierarchyDTO[]
}


@State<MetadataStateModel>({
  name: 'metadata',
  defaults: {
    metadata: null,
    types: null,
    hierarchy:null,
  }
})
@Injectable()
export class MetadataState {

  @Selector()
  public static getMetadata(state: MetadataStateModel) {
    return state.metadata;
  }

  @Selector()
  public static getResourceTypeHierarchy(state: MetadataStateModel) {
    return state.hierarchy;
  }

  @Selector()
  public static getMetadataTypes(state: MetadataStateModel) {
    return state.types;
  }

  constructor(private metadataService: MetadataService, private resourceApiService: ResourceApiService) { }

  ngxsOnInit(ctx: StateContext<MetadataStateModel>) {
  }

  @Action(FetchResourceTypeHierarchy)
  fetchResourceTypeHierarchy({ patchState }: StateContext<MetadataStateModel>, { }: FetchResourceTypeHierarchy) {
    this.resourceApiService.getHierarchy().subscribe(res => {
      patchState({
        hierarchy: res
      });
    });
  }

  @Action(FetchMetadata)
  fetchMetadata({ patchState }: StateContext<MetadataStateModel>, { }: FetchMetadata) {
    this.metadataService.getMetadata().subscribe(res => {
      const types = res[Constants.Metadata.EntityType].properties[Constants.Shacl.Taxonomy];
      patchState({
        types: types
      });

      patchState({
        metadata: res
      });
    });
  }

  @Action(FetchMetadataTypes)
  fetchMetadataTypes({ patchState }: StateContext<MetadataStateModel>, { }: FetchMetadataTypes) {
    this.metadataService.getMetadata().subscribe(res => {
      if (res) {
        const types = res[Constants.Metadata.EntityType].properties[Constants.Shacl.Taxonomy];
        patchState({
          types: types
        });
      } else {
        patchState({
          types: null
        });
      }
    });
  }
}
