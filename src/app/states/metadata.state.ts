import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { MetadataService } from "../core/http/metadata.service";
import { ResourceApiService } from "src/app/core/http/resource.api.service";

import { Constants } from "../shared/constants";
import { CheckboxHierarchyDTO } from "../shared/models/checkboxHierarchy-dto";
import { MetaDataProperty } from "../shared/models/metadata/meta-data-property";
import { tap } from "rxjs/operators";
import { EMPTY } from "rxjs";

export class FetchMetadata {
  static readonly type = "[Metadata] FetchMetadata";
}

export class FetchEntityMetadata {
  static readonly type = "[Metadata] FetchEntityMetadata";

  constructor(public entityType: string) {}
}

export class FetchResourceTypeHierarchy {
  static readonly type = "[Metadata] FetchResourceTypeHierarchy";
}
export class ToggleCategoryFilterTab {
  static readonly type = "[Metadata] ToggleCategoryFilterTab";
  constructor(public tabNumber: number) {}
}
export class ToggleResourceTypeItem {
  static readonly type = "[Metadata] ToggleResourceTypeItem";
  constructor(public id: string) {}
}
export class EnableResourceTypeItem {
  static readonly type = "[Metadata] EnableResourceTypeItem";
  constructor(public idList: string[]) {}
}
export class DisableResourceTypeItem {
  static readonly type = "[Metadata] DisableResourceTypeItem";
  constructor(public idList: string[]) {}
}
export class ClearResourceTypeItem {
  static readonly type = "[Metadata] ClearResourceTypeItem";
  constructor() {}
}
export interface MetadataStateModel {
  metadata: any;
  metadataType: string;
  entityMetadata: Map<string, Array<MetaDataProperty>>;
  types: any;
  hierarchy: CheckboxHierarchyDTO[];
  categoryTab: number;
  activeNodes: string[];
}

@State<MetadataStateModel>({
  name: "metadata",
  defaults: {
    metadata: null,
    metadataType: null,
    entityMetadata: new Map<string, Array<MetaDataProperty>>(),
    types: null,
    hierarchy: null,
    categoryTab: 0,
    activeNodes: [],
  },
})
@Injectable()
export class MetadataState {
  @Selector()
  public static getActiveCategoryTab(state: MetadataStateModel) {
    return state.categoryTab;
  }

  @Selector()
  public static getActiveNodes(state: MetadataStateModel) {
    return state.activeNodes;
  }

  @Selector()
  public static getMetadata(state: MetadataStateModel) {
    return state.metadata;
  }

  @Selector()
  public static actualMetadata(
    state: MetadataStateModel
  ): Array<MetaDataProperty> {
    return state.metadata.has(state.metadataType)
      ? state.metadata.get(state.metadataType)
      : new Array<MetaDataProperty>();
  }

  @Selector()
  public static actualMetadataHasMainDistributionEndpoint(
    state: MetadataStateModel
  ): boolean {
    return this.actualMetadata(state).some(
      (m) => m.key === Constants.Metadata.MainDistribution
    );
  }

  @Selector()
  public static getEntityMetadata(state: MetadataStateModel) {
    return state.entityMetadata;
  }

  @Selector()
  public static getResourceTypeHierarchy(state: MetadataStateModel) {
    return state.hierarchy;
  }

  @Selector()
  public static getMetadataTypes(state: MetadataStateModel) {
    return state.types;
  }

  constructor(
    private metadataService: MetadataService,
    private resourceApiService: ResourceApiService
  ) {}

  @Action(ToggleCategoryFilterTab)
  toggleCategoryFilterTab(
    { patchState }: StateContext<MetadataStateModel>,
    { tabNumber }: ToggleCategoryFilterTab
  ) {
    patchState({
      categoryTab: tabNumber,
    });
  }

  @Action(ToggleResourceTypeItem)
  toggleResourceTypeItem(
    { getState, patchState }: StateContext<MetadataStateModel>,
    { id }: ToggleResourceTypeItem
  ) {
    var list = getState().activeNodes;
    if (!list.includes(id)) {
      list.push(id);
    } else {
      const index = list.indexOf(id, 0);
      if (index > -1) {
        list.splice(index, 1);
      }
    }
    patchState({
      activeNodes: list,
    });
  }

  @Action(EnableResourceTypeItem)
  EnableResourceTypeItem(
    { getState, patchState }: StateContext<MetadataStateModel>,
    { idList }: EnableResourceTypeItem
  ) {
    var list = getState().activeNodes;
    idList.forEach((element) => {
      if (!list.includes(element)) {
        list.push(element);
      }
    });

    patchState({
      activeNodes: list,
    });
  }
  @Action(DisableResourceTypeItem)
  DisableResourceTypeItem(
    { getState, patchState }: StateContext<MetadataStateModel>,
    { idList }: DisableResourceTypeItem
  ) {
    var list = getState().activeNodes;
    idList.forEach((element) => {
      if (list.includes(element)) {
        const index = list.indexOf(element, 0);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
    });
    patchState({
      activeNodes: list,
    });
  }

  @Action(ClearResourceTypeItem)
  ClearResourceTypeItem(
    { patchState }: StateContext<MetadataStateModel>,
    {}: ClearResourceTypeItem
  ) {
    patchState({
      activeNodes: [],
    });
  }

  @Action(FetchResourceTypeHierarchy)
  fetchResourceTypeHierarchy(
    { patchState }: StateContext<MetadataStateModel>,
    {}: FetchResourceTypeHierarchy
  ) {
    this.resourceApiService.getHierarchy().subscribe((res) => {
      patchState({
        hierarchy: res,
      });
    });
  }

  @Action(FetchMetadata)
  fetchMetadata(
    { patchState }: StateContext<MetadataStateModel>,
    {}: FetchMetadata
  ) {
    this.metadataService.getMetadata().subscribe((res) => {
      const types =
        res[Constants.Metadata.EntityType].properties[Constants.Shacl.Taxonomy];
      patchState({
        types: types,
      });

      patchState({
        metadata: res,
      });
    });
  }

  @Action(FetchEntityMetadata)
  fetchEntityMetadata(
    ctx: StateContext<MetadataStateModel>,
    action: FetchEntityMetadata
  ) {
    const state = ctx.getState();
    if (state.entityMetadata.has(action.entityType)) {
      return EMPTY;
    }

    return this.metadataService.getEntityMetadata(action.entityType).pipe(
      tap((res) => {
        const entityMetadataMap = ctx.getState().entityMetadata;
        entityMetadataMap.set(action.entityType, res);
        ctx.patchState({
          entityMetadata: entityMetadataMap,
        });
      })
    );
  }
}
