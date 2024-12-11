import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GraphDto } from 'src/app/shared/models/graphs/graph-dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GraphUploadDialogComponent } from './graph-upload-dialog/graph-upload-dialog.component';
import { GraphManagementApiService } from 'src/app/core/http/graph-management-api.service';
import { saveAs } from 'file-saver-es';
import { EntityFormStatus } from 'src/app/shared/components/entity-form/entity-form-status';
import { environment } from 'src/environments/environment';

export enum GraphManagmentAction {
  LOADING = 'loading',
  DELETION = 'deletion',
  DOWNLOAD = 'download'
}

@Component({
  selector: 'app-graph-management',
  templateUrl: './graph-management.component.html',
  styleUrls: ['./graph-management.component.scss']
})
export class GraphManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'status', 'startTime', 'action'];

  loadingStatus: EntityFormStatus = EntityFormStatus.INITIAL;
  currentAction: GraphManagmentAction;
  downloadingGraphs: string[] = [];

  graphs: GraphDto[];
  dataSource: MatTableDataSource<GraphDto>;

  sortChangeSubscription: Subscription;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  get isLoading(): boolean {
    return this.loadingStatus === EntityFormStatus.LOADING;
  }

  constructor(
    private graphApiService: GraphManagementApiService,
    private snackBar: ColidMatSnackBarService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // If the user changes the sort order, reset back to the first page.
    this.sortChangeSubscription = this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0)
    );

    this.loadGraphs();
  }

  ngOnDestroy() {
    this.sortChangeSubscription.unsubscribe();
  }

  isLoadingAction(action: string): boolean {
    return this.isLoading && this.currentAction === action;
  }

  loadGraphs() {
    this.currentAction = GraphManagmentAction.LOADING;
    this.loadingStatus = EntityFormStatus.LOADING;

    this.graphApiService.getGraphs().subscribe(
      (res) => {
        this.dataSource.data = res.filter((x) => !x.name.includes('Rev'));
        this.loadingStatus = EntityFormStatus.SUCCESS;
      },
      (_) => {
        this.loadingStatus = EntityFormStatus.ERROR;
      }
    );
  }

  deleteGraph(graph: GraphDto) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Delete Graph`,
        body: `Are you sure you want to delete the graph:<br><br> ${graph.name}`
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.currentAction = GraphManagmentAction.DELETION;
        this.loadingStatus = EntityFormStatus.LOADING;
        this.graphApiService.deleteGraph(graph.name).subscribe(
          (_) => {
            this.loadingStatus = EntityFormStatus.SUCCESS;
            this.loadGraphs();
            this.snackBar.success('Graph', 'Deleted successfully');
          },
          (_) => {
            this.loadingStatus = EntityFormStatus.ERROR;
          }
        );
      }
    });
  }

  downloadGraph(namedGraph: string) {
    this.currentAction = GraphManagmentAction.DOWNLOAD;
    this.loadingStatus = EntityFormStatus.LOADING;
    this.downloadingGraphs.push(namedGraph);

    this.graphApiService.downloadGraph(namedGraph).subscribe(
      (blob) => {
        saveAs(blob, this.getFileName(namedGraph));
        this.downloadingGraphs = this.downloadingGraphs.filter(
          (x) => x !== namedGraph
        );
        this.loadingStatus = EntityFormStatus.SUCCESS;
      },
      (_) => {
        this.downloadingGraphs = this.downloadingGraphs.filter(
          (x) => x !== namedGraph
        );
        this.snackBar.error(
          'Error',
          'An error occured during the graph download!'
        );
        this.loadingStatus = EntityFormStatus.ERROR;
      }
    );
  }

  getFileName(namedGraph: string): string {
    var prefix = `https://pid.${environment.baseUrl}/`;
    var filename =
      namedGraph.replace(prefix, '').replace('graph/', '').replace('/', '__') +
      '.ttl';
    return filename;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  uploadGraph() {
    const dialogRef = this.dialog.open(GraphUploadDialogComponent, {
      minWidth: '40vw',
      minHeight: '30vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadGraphs();
      }
    });
  }
}
