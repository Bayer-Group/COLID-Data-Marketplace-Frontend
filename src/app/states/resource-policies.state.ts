import { Selector, State, Store } from "@ngxs/store";
import { IronMountainService } from "../core/http/iron-mountain.api.service";
import { ResourceRetentionClasses } from "../shared/models/resourcePolicies/resource-retentionClass";
import { SearchResult } from "../shared/models/search-result";
import { Injectable } from "@angular/core";

export class FetchResourcePolicies {
  static readonly type = "[ResourcePolicies] Fetch FetchResourcePolicies";
  constructor(public searchResult: SearchResult) {}
}

export class ResourcePoliciesStateModel {
  loading: boolean;
  resourcePolicies: ResourceRetentionClasses[];
}

@State<ResourcePoliciesStateModel>({
  name: "ResourcePolicies",
  defaults: {
    loading: false,
    resourcePolicies: [],
  },
})
@Injectable()
export class ResourcePoliciesState {
  constructor(
    private ironMountainApiService: IronMountainService,
    private store: Store
  ) {}

  @Selector()
  public static getPolicies(state: ResourcePoliciesStateModel) {
    return state.resourcePolicies;
  }
  @Selector()
  public static getLoadingState(state: ResourcePoliciesStateModel) {
    return state.loading;
  }

  // @Action(FetchResourcePolicies)
  // FetchResourcePolicies(
  //   { patchState }: StateContext<ResourcePoliciesStateModel>,
  //   { searchResult }: FetchResourcePolicies
  // ) {
  //   patchState({
  //     loading: true,
  //   });
  //   var dataCategoryResources = searchResult.hits.hits.filter(
  //     (x) => x.source[Constants.Metadata.HasDataCategory]
  //   );
  //   if (dataCategoryResources.length >= 1) {
  //     var policyRequestValues = [];
  //     dataCategoryResources.map((x) => {
  //       var dict = new policyRequest(
  //         decodeURIComponent(x.id),
  //         x.source[Constants.Metadata.HasDataCategory].outbound.map(
  //           (x) => x.uri
  //         ),
  //         x.source[Constants.Metadata.HasCountryContext]
  //           ? x.source[Constants.Metadata.HasCountryContext].outbound.map(
  //               (x) => x.uri
  //             )
  //           : []
  //       );
  //       policyRequestValues.push(dict);
  //     });

  //     this.ironMountainApiService
  //       .getIronMountainResourcePolicies(policyRequestValues)
  //       .subscribe((cs) => {
  //         patchState({
  //           loading: false,
  //           resourcePolicies: cs,
  //         });
  //       });
  //   } else {
  //     patchState({
  //       loading: false,
  //       resourcePolicies: [],
  //     });
  //   }
  // }
}
