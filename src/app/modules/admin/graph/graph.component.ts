import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  FetchGraphMetadata,
  FetchGraph,
  UnselectHistoricGraph
} from '../../../states/graph.state';
import { ReindexApiService } from 'src/app/core/http/reindex.api.service';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, OnDestroy {
  reindexingInProgress = false;

  constructor(
    private store: Store,
    private indexApiService: ReindexApiService,
    private snackBar: ColidMatSnackBarService
  ) {}

  ngOnInit() {
    this.store
      .dispatch([new FetchGraphMetadata(), new FetchGraph()])
      .subscribe();
  }

  ngOnDestroy() {
    this.store.dispatch(new UnselectHistoricGraph());
  }

  reindex() {
    this.reindexingInProgress = true;
    this.indexApiService.reindex().subscribe(
      () => {
        this.snackBar.success(
          'Reindexing successful',
          'Reindexing was successfully started and is running in the background.'
        );
        this.reindexingInProgress = false;
      },
      (error) => {
        this.snackBar.error(
          'Reindexing went wrong',
          'An error occurred during reindexing. Please try again.',
          error
        );
        this.reindexingInProgress = false;
      }
    );
  }
}
