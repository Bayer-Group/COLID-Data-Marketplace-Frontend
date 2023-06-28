import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { ResourceApiService } from "../core/http/resource.api.service";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { LogService } from "../core/logging/log.service";
import { Resource } from "../shared/models/resources/resource";
import { Entity } from "../shared/models/entities/entity";
import { ResourceOverviewCTO } from "../shared/models/resources/resource-overview-cto";
import {
  HistoricResourceOverviewDTO,
  ResourceRevisionHistory,
} from "../shared/models/resources/historic-resource-overview-dto";
import { Constants } from "../shared/constants";

import { Injectable } from "@angular/core";
import { ResourceSearchDTO } from "../shared/models/resources/resource-search-dto";

export class DeleteResources {
  static readonly type = "[Resources] Delete";
  constructor(public payload: string[], public requester: string) {}
}

export class FetchResourceMarkedAsDeleted {
  static readonly type = "[Resource] FetchMarkedDeleted";
}

export class RejectResourceMarkedAsDeleted {
  static readonly type = "[Resource] RejectMarkedAsDeleted";
  constructor(public payload: string[]) {}
}

export class SetMainDistribution {
  static readonly type = "[Resource] SetMainDistribution";

  constructor(public mainDistributionId: string) {}
}

export class ResourceStateModel {
  activeResource: Resource;
  fetched: boolean;
  loadingMarked: boolean;
  markedResource: ResourceOverviewCTO;
  activeMainDistribution: string;
  history: Array<HistoricResourceOverviewDTO>;
  revisionHistory: Array<ResourceRevisionHistory>;
  historicResources: Map<string, Resource>;
  selectedHistoricResource: string;
}

@State<ResourceStateModel>({
  name: "resource",
  defaults: {
    fetched: false,
    activeResource: null,
    activeMainDistribution: null,
    loadingMarked: false,
    markedResource: null,
    history: null,
    revisionHistory: null,
    selectedHistoricResource: null,
    historicResources: new Map<string, Resource>(),
  },
})
@Injectable()
export class ResourceState {
  constructor(
    private logger: LogService,
    private resourceService: ResourceApiService,
    private store: Store,
    private router: Router
  ) {}

  @Selector()
  public static getIsResourcesMarkedDeletedLoading(state: ResourceStateModel) {
    return state.loadingMarked;
  }

  @Selector()
  public static getResourcesMarkedDeleted(state: ResourceStateModel) {
    return state.markedResource;
  }

  @Selector()
  public static activeResource(state: ResourceStateModel) {
    return state.activeResource;
  }

  @Selector()
  public static getIsFetched(state: ResourceStateModel) {
    return state.fetched;
  }

  @Selector()
  public static getActiveMainDistribution(state: ResourceStateModel) {
    return state.activeMainDistribution;
  }

  @Selector()
  public static getResourceHistory(state: ResourceStateModel) {
    return state.history;
  }

  @Selector()
  public static getResourceRevisionHistory(state: ResourceStateModel) {
    return state.revisionHistory;
  }

  @Selector()
  public static getHistoricResources(state: ResourceStateModel) {
    return state.historicResources;
  }

  @Selector()
  public static getSelectedHistoricResource(state: ResourceStateModel) {
    return state.selectedHistoricResource;
  }

  private patchState(
    ctx: StateContext<ResourceStateModel>,
    resource: Resource
  ) {
    const result = this.transformResourceAndGetMainDistribution(resource);
    ctx.patchState({
      fetched: true,
      activeResource: result.resource,
      activeMainDistribution: result.mainDistribution,
    });
  }

  private returnResourceTypeFromProperties(properties: {
    [id: string]: any[];
  }): string[] {
    return properties[Constants.Metadata.EntityType];
  }

  private returnMetadataReleaseFromProperties(properties: {
    [id: string]: any[];
  }): string[] {
    return properties[Constants.Metadata.MetadataReleaseConfig];
  }

  private transformResourceAndGetMainDistribution(resource: Resource) {
    let mainDistribution: string;

    if (
      resource.properties[Constants.Metadata.MainDistribution] != null &&
      resource.properties[Constants.Metadata.MainDistribution].length
    ) {
      const mainDistributionEndpoint: Entity =
        resource.properties[Constants.Metadata.MainDistribution][0];
      mainDistribution = mainDistributionEndpoint.id;
    }

    return { resource: resource, mainDistribution: mainDistribution };
  }

  @Action(RejectResourceMarkedAsDeleted)
  rejectResourceMarkedAsDeleted(
    { patchState }: StateContext<ResourceStateModel>,
    { payload }: RejectResourceMarkedAsDeleted
  ) {
    patchState({
      loadingMarked: true,
    });
    return this.resourceService.rejectResourcesMarkedDeleted(payload).pipe(
      tap(
        () => {},
        (_) => {
          patchState({
            loadingMarked: false,
          });
        }
      )
    );
  }

  @Action(FetchResourceMarkedAsDeleted)
  fetchResourceMarkedAsDeleted(
    { patchState }: StateContext<ResourceStateModel>,
    {}: FetchResourceMarkedAsDeleted
  ) {
    patchState({
      loadingMarked: true,
    });

    const searchObject = new ResourceSearchDTO();
    searchObject.markedForDeletion = true;
    searchObject.limit = 1000;

    this.resourceService.getFilteredResources(searchObject).subscribe((res) => {
      patchState({
        markedResource: res,
        loadingMarked: false,
      });
    });
  }

  @Action(DeleteResources)
  deleteResources(
    { patchState }: StateContext<ResourceStateModel>,
    { payload, requester }: DeleteResources
  ) {
    patchState({
      loadingMarked: true,
    });
    return this.resourceService.deleteResources(payload, requester);
  }

  @Action(SetMainDistribution)
  setMainDistribution(
    { getState, patchState }: StateContext<ResourceStateModel>,
    { mainDistributionId }: SetMainDistribution
  ) {
    const activeMainDistribution = getState().activeMainDistribution;
    patchState({
      activeMainDistribution:
        activeMainDistribution === mainDistributionId
          ? null
          : mainDistributionId,
    });
  }
}
