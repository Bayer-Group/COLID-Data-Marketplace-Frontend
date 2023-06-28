import { State, Action, StateContext, Selector } from "@ngxs/store";
import { GraphApiService } from "src/app/core/http/graph.api.service";
import { tap } from "rxjs/operators";
import { GraphOverViewDto } from "src/app/shared/models/graphs/graph-overview-dto";
import { GraphResultDTO } from "src/app/shared/models/graphs/graph-result-dto";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { GraphRequestDTO } from "src/app/shared/models/graphs/graph-request-dto";
import { MetadataService } from "src/app/core/http/metadata.service";
import { Constants } from "src/app/shared/constants";
import { Injectable } from "@angular/core";

export class FetchGraph {
  static readonly type = "[Graph] Fetch graph";
  constructor() {}
}

export class FetchHistory {
  static readonly type = "[Graph] Fetch history";
  constructor() {}
}

export class FetchGraphMetadata {
  static readonly type = "[Graph] Fetch metadata";
  constructor() {}
}

export class FetchHistoricGraph {
  static readonly type = "[Graph] Fetch historic graph";
  constructor(public payload: string) {}
}

export class CreateGraph {
  static readonly type = "[Graph] Create graph";
  constructor(public payload: GraphRequestDTO) {}
}

export class UnselectHistoricGraph {
  static readonly type = "[Graph] UnselectHistoricGraph";
}

export class GraphStateModel {
  history: GraphOverViewDto[];
  historicGraphs: Map<string, GraphResultDTO>;
  selectedHistoricGraph: string;
  actualGraph: GraphResultDTO;
  metadata: MetaDataProperty[];
}

@State<GraphStateModel>({
  name: "graphs",
  defaults: {
    history: null,
    historicGraphs: new Map<string, GraphResultDTO>(),
    selectedHistoricGraph: null,
    actualGraph: null,
    metadata: null,
  },
})
@Injectable()
export class GraphState {
  constructor(
    private graphApiService: GraphApiService,
    private metadataService: MetadataService
  ) {}

  @Selector()
  public static getHistory(state: GraphStateModel) {
    return state.history;
  }

  @Selector()
  public static getHistoricGraphs(state: GraphStateModel) {
    return state.historicGraphs;
  }

  @Selector()
  public static getSelectedHistoricGraph(state: GraphStateModel) {
    return state.selectedHistoricGraph;
  }

  @Selector()
  public static getActualGraph(state: GraphStateModel) {
    return state.actualGraph;
  }

  @Selector()
  public static getGraphMetadata(state: GraphStateModel) {
    return state.metadata;
  }

  @Action(FetchHistoricGraph)
  fetchHistoricGraph(
    { getState, patchState }: StateContext<GraphStateModel>,
    { payload }: FetchHistoricGraph
  ) {
    const historicGraphs = getState().historicGraphs;

    if (historicGraphs.has(payload)) {
      patchState({
        selectedHistoricGraph: payload,
      });
      return;
    }

    return this.graphApiService.getHistoricGraph(payload).pipe(
      tap((res) => {
        historicGraphs.set(payload, res);
        patchState({
          historicGraphs: historicGraphs,
          selectedHistoricGraph: payload,
        });
      })
    );
  }

  @Action(FetchGraph)
  fetchGraph({ patchState }: StateContext<GraphStateModel>, {}: FetchGraph) {
    patchState({
      actualGraph: null,
    });

    return this.graphApiService.getGraph().pipe(
      tap((res) => {
        patchState({
          actualGraph: res,
        });
      })
    );
  }

  @Action(UnselectHistoricGraph)
  unselectHistoricGraph(
    { patchState }: StateContext<GraphStateModel>,
    {}: UnselectHistoricGraph
  ) {
    patchState({
      selectedHistoricGraph: null,
    });
  }

  @Action(FetchHistory)
  fetchHistory(
    { patchState }: StateContext<GraphStateModel>,
    {}: FetchHistory
  ) {
    return this.graphApiService.getHistory().pipe(
      tap((res) => {
        patchState({
          history: res,
        });
      })
    );
  }

  @Action(FetchGraphMetadata)
  fetchGraphMetadata(
    { getState, patchState }: StateContext<GraphStateModel>,
    {}: FetchGraphMetadata
  ) {
    if (getState().metadata != null) {
      return;
    }

    return this.metadataService
      .getMetaData(Constants.ResourceTypes.MetadataGraphConfiguration)
      .pipe(
        tap((res) => {
          patchState({
            metadata: res,
          });
        })
      );
  }

  @Action(CreateGraph)
  createGraph(
    { dispatch, patchState }: StateContext<GraphStateModel>,
    { payload }: CreateGraph
  ) {
    return this.graphApiService.createGraph(payload).pipe(
      tap((res) => {
        dispatch(new FetchHistory());
        patchState({
          actualGraph: res.entity,
        });
      })
    );
  }
}
