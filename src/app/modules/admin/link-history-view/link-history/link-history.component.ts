import {
  ChangeDetectionStrategy,
  Output,
  Component,
  Input,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { AppMaterialModule } from 'src/app/app-material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IconTypes } from 'src/app/modules/colid-icons/models/icon-types';
import { Constants } from 'src/app/shared/constants';
import { ColidIconsModule } from 'src/app/modules/colid-icons/colid-icons.module';
import { BehaviorSubject, EMPTY, Observable, ReplaySubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserInfoState } from 'src/app/states/user-info.state';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ColidSnackBarModule } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.module';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { environment } from 'src/environments/environment';

export interface HistoryItemTableEntry {
  linkType: {
    key: string;
    value: string;
  };
  linkStatus: string;
  source: string;
  sourceName: string;
  sourceType: string;
  target: string;
  targetName: string;
  targetType: string;
  dateCreated: string;
  dateDeleted: string;
  author: string;
  deletedBy: string;
}

@Component({
  selector: 'colid-link-history',
  standalone: true,
  imports: [
    CommonModule,
    AppMaterialModule,
    InfiniteScrollModule,
    ColidIconsModule,
    ColidSnackBarModule
  ],
  templateUrl: './link-history.component.html',
  styleUrls: ['./link-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkHistoryComponent {
  @Input() set isLoading(value: boolean) {
    this.isLoading$.next(value);
  }
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  @Input() set historyItemsSource(value: HistoryItemTableEntry[]) {
    this.historyItems.setData(value);
  }
  historyItems = new HistoryItemDataSource(null);
  @Output() currentHistoryItemsCount = new EventEmitter<number>();
  @Output() sortingColumn = new EventEmitter<{
    column: string;
    descending?: boolean;
  }>();
  S3: IconTypes = IconTypes.S3;
  constants = Constants;

  displayedColumns = [
    'source',
    'sourceType',
    'linkType',
    'target',
    'targetType',
    'createddate',
    'createdby',
    'deletiondate',
    'deletedby',
    'status',
    'restoreAction'
  ];

  constructor(
    private dialog: MatDialog,
    private resourceApiService: ResourceApiService,
    private store: Store,
    private snackbar: ColidMatSnackBarService
  ) {}

  onSortChange(sort: Sort) {
    const { active, direction } = sort;
    const isDescending =
      direction === 'desc' ? true : direction === 'asc' ? false : null;
    this.sortingColumn.emit({ column: active, descending: isDescending });
  }

  onScrolled(_) {
    this.currentHistoryItemsCount.emit(this.historyItems.getHistoryItemCount());
  }

  openInDMPResourceDetailView(pidUri: string) {
    const url = `${environment.dmpUrl}resource-detail?pidUri=${pidUri}`;
    window.open(url, '_blank');
  }

  onRestoreLink(item: HistoryItemTableEntry) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        header: 'Confirm Link Recovery',
        body: `
          <p>Are you sure you want to restore the following link:</p>
          <p><b>Source:</b> ${item.sourceName}</p>
          <p><b>Target:</b> ${item.targetName}</p>
          <p><b>Link Type:</b> ${item.linkType.value}</p>
        `
      },
      width: 'auto',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const userEmailAddress = this.store.selectSnapshot(
          UserInfoState.getUser
        ).emailAddress;
        this.resourceApiService
          .createLink(
            item.source,
            item.linkType.key,
            item.target,
            userEmailAddress
          )
          .pipe(
            catchError((error) => {
              this.snackbar.error(
                'Linking resources',
                error.error?.message || 'Could not restore the link'
              );
              return EMPTY;
            })
          )
          .subscribe((_) => {
            this.snackbar.success(
              'Linking resources',
              'Successfully restored the link'
            );
          });
      }
    });
  }
}

class HistoryItemDataSource extends DataSource<HistoryItemTableEntry> {
  private _dataStream = new ReplaySubject<HistoryItemTableEntry[] | null>();
  private _historyItemCount: number = 0;

  constructor(initialData: HistoryItemTableEntry[] | null) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<HistoryItemTableEntry[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: HistoryItemTableEntry[]) {
    this._dataStream.next(data);
    this._historyItemCount = data?.length || 0;
  }

  getHistoryItemCount() {
    return this._historyItemCount;
  }
}
