import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { KeywordManagementApiService } from "../core/http/keyword-management.api.service";
import { catchError, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { GraphKeywordUsage } from "../shared/models/key-management/graph-keyword-usage-dto";

export class KeywordManagementStateModel {
  keywordGraphsPidUris: string[];
  selectedKeywordGraphUsage: GraphKeywordUsage[];
  loadingKeywordGraph: boolean;
  graphTypeSelectedInstanceGraph: string[];
}

export class FetchKeywordGraphs {
  static readonly type = "[KeywordManagement] Fetch keyword graphs";
  constructor() {}
}

export class FetchGraphTypeInstanceGraph {
  static readonly type =
    "[KeywordManagement] Fetch graph type of selected instance graph";
  constructor(public selectedInstanceGraph: string) {}
}

export class FetchGraphKeywordUsage {
  static readonly type = "[KeywordManagement] Fetch graph keyword usage";
  constructor(public keywordGraphUri: string) {}
}

export class ResetGraphKeywordUsageData {
  static readonly type = "[KeywordManagement] Reset graph keyword usage data";
  constructor() {}
}

@State<KeywordManagementStateModel>({
  name: "KeywordManagement",
  defaults: {
    keywordGraphsPidUris: null,
    selectedKeywordGraphUsage: null,
    loadingKeywordGraph: false,
    graphTypeSelectedInstanceGraph: [],
  },
})
@Injectable()
export class KeywordManagementState {
  constructor(
    private keywordManagmentApiService: KeywordManagementApiService
  ) {}

  @Selector()
  public static getKeywordGraphsPidUris(state: KeywordManagementStateModel) {
    return state.keywordGraphsPidUris;
  }

  @Selector()
  public static getGraphTypeSelectedInstanceGraph(
    state: KeywordManagementStateModel
  ) {
    return state.graphTypeSelectedInstanceGraph;
  }

  @Selector()
  public static getSelectedKeywordGraphUsage(
    state: KeywordManagementStateModel
  ) {
    return state.selectedKeywordGraphUsage;
  }

  @Selector()
  public static getKeywordGraphLoading(state: KeywordManagementStateModel) {
    return state.loadingKeywordGraph;
  }

  @Action(FetchKeywordGraphs)
  FetchKeywordGraphs({
    patchState,
  }: StateContext<KeywordManagementStateModel>) {
    return this.keywordManagmentApiService.getKeywordGraphs().pipe(
      tap((res: string[]) => {
        patchState({
          keywordGraphsPidUris: res,
        });
      })
    );
  }

  @Action(FetchGraphTypeInstanceGraph)
  FetchGraphTypeInstanceGraph(
    { patchState }: StateContext<KeywordManagementStateModel>,
    { selectedInstanceGraph }: FetchGraphTypeInstanceGraph
  ) {
    return this.keywordManagmentApiService
      .getGraphTypeOfSelectedInstanceGraph(selectedInstanceGraph)
      .pipe(
        tap((res: string[]) => {
          patchState({
            graphTypeSelectedInstanceGraph: res,
          });
        }),
        catchError((err) => {
          patchState({
            graphTypeSelectedInstanceGraph: [],
          });
          console.log(err);
          return EMPTY;
        })
      );
  }

  @Action(FetchGraphKeywordUsage)
  FetchGraphKeywordUsage(
    { patchState }: StateContext<KeywordManagementStateModel>,
    { keywordGraphUri }: FetchGraphKeywordUsage
  ) {
    patchState({ loadingKeywordGraph: true });
    return this.keywordManagmentApiService
      .getKeywordGraphUsage(keywordGraphUri)
      .pipe(
        tap((res: GraphKeywordUsage[]) => {
          patchState({
            selectedKeywordGraphUsage: res,
            loadingKeywordGraph: false,
          });
        })
      );
  }

  @Action(ResetGraphKeywordUsageData)
  ResetGraphKeywordUsageData({
    patchState,
  }: StateContext<KeywordManagementStateModel>) {
    patchState({
      selectedKeywordGraphUsage: null,
      graphTypeSelectedInstanceGraph: [],
    });
  }
}
