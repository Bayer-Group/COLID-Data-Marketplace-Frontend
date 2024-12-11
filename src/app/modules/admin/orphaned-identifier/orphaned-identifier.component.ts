import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  IdentifierState,
  FetchOrphanedIdentifiers,
  DeleteOrphanedIdentifier
} from 'src/app/states/identifier.state';
import { Select, Store } from '@ngxs/store';
import { IdentifierResultDTO } from 'src/app/shared/models/identifier/identifier-result-dto';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { EntityFormStatus } from 'src/app/shared/models/entity-form.status';

@Component({
  selector: 'app-oprhaned-identifier',
  templateUrl: './orphaned-identifier.component.html',
  styleUrls: ['./orphaned-identifier.component.css']
})
export class OrphanedIdentifierComponent implements OnInit, OnDestroy {
  @Select(IdentifierState.getIsLoading) loading$: Observable<boolean>;
  @Select(IdentifierState.getIdentifiers) identifiers$: Observable<
    IdentifierResultDTO[]
  >;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['identifierUri', 'delete'];

  dataSource: MatTableDataSource<IdentifierResultDTO>;
  dataSourceLength: number = 0;

  sortChangeSubscription: Subscription;
  identifierSubscription: Subscription;

  status: EntityFormStatus = EntityFormStatus.INITIAL;
  entityFormStatus = EntityFormStatus;
  selectedIdentifier: string;

  get isLoading(): boolean {
    return (
      this.status === EntityFormStatus.LOADING ||
      this.status === EntityFormStatus.RELOADING
    );
  }

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private snackBar: ColidMatSnackBarService
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // If the user changes the sort order, reset back to the first page.
    this.sortChangeSubscription = this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0)
    );

    this.loadData();

    this.identifierSubscription = this.identifiers$.subscribe((uris) => {
      const data = uris == null ? [] : uris;
      this.dataSourceLength = data.length;
      this.dataSource.data = data;
    });
  }

  ngOnDestroy() {
    this.sortChangeSubscription.unsubscribe();
    this.identifierSubscription.unsubscribe();
  }

  loadData() {
    this.status = EntityFormStatus.RELOADING;
    this.store.dispatch(new FetchOrphanedIdentifiers()).subscribe(
      (_) => (this.status = EntityFormStatus.SUCCESS),
      (_) => (this.status = EntityFormStatus.ERROR)
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteOrphanedIdentifier(identifierUri: string) {
    this.selectedIdentifier = identifierUri;
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Deleting Identifier`,
        body: `Are you sure you want to delete the following identifier:<br><br> ${identifierUri}`
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.status = EntityFormStatus.LOADING;

        this.store
          .dispatch(new DeleteOrphanedIdentifier(identifierUri))
          .subscribe(
            (_) => {
              this.snackBar.success(
                'Permanent Identifier',
                'Deleted successfully'
              );
              this.status = EntityFormStatus.SUCCESS;
              this.loadData();
            },
            (_) => {
              this.status = EntityFormStatus.ERROR;
            }
          );
      }
    });
  }
}
