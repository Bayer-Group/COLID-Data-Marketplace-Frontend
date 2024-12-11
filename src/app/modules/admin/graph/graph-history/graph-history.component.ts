import { Component, OnInit } from '@angular/core';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import {
  GraphState,
  FetchHistory,
  FetchHistoricGraph
} from '../../../../states/graph.state';
import { Observable } from 'rxjs';
import { GraphOverViewDto } from 'src/app/shared/models/graphs/graph-overview-dto';
import { Select, Store } from '@ngxs/store';
import { GraphResultDTO } from 'src/app/shared/models/graphs/graph-result-dto';

@Component({
  selector: 'app-graph-history',
  templateUrl: './graph-history.component.html',
  styleUrls: ['./graph-history.component.css']
})
export class GraphHistoryComponent implements OnInit {
  @Select(GraphState.getHistory) history$: Observable<GraphOverViewDto[]>;
  @Select(GraphState.getGraphMetadata) metadata$: Observable<
    Array<MetaDataProperty>
  >;
  @Select(GraphState.getHistoricGraphs) historicGraphs$: Observable<
    Map<string, GraphResultDTO>
  >;
  @Select(GraphState.getSelectedHistoricGraph)
  selectedHistoricGraph$: Observable<string>;

  initialFetched = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new FetchHistory()).subscribe();
  }

  handleSelectionChanged(entity: GraphOverViewDto) {
    if (!entity) return;

    this.store.dispatch(new FetchHistoricGraph(entity.id)).subscribe();
  }
}
