import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { EMPTY, Observable } from 'rxjs';
import { Constants } from 'src/app/shared/constants';
import { Favorites } from 'src/app/shared/models/favorites';
import {
  FavoritesState,
  FetchFavoriteListEntries,
  FetchFavorites,
  ResetEntryDetailsMetadata,
  SetEntryDetailsMetadata
} from '../../favorites.state';
import { DeleteFavoriteListComponent } from '../delete-favorite-list/delete-favorite-list.component';
import { EditFavoriteListComponent } from '../edit-favorite-list/edit-favorite-list.component';
import { RemoveFavoriteEntryComponent } from '../remove-favorite-entry/remove-favorite-entry.component';
import { FavoritesService } from 'src/app/components/favorites/services/favorites.service';
import { switchMap, tap } from 'rxjs/operators';
import { ExportDialogComponent } from 'src/app/components/export-dialog/export-dialog.component';
import { ExportSettings } from 'src/app/shared/models/export/export-settings';
import { ExportService } from 'src/app/core/http/export.service';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MultiselectWarningDialogComponent } from 'src/app/components/multiselect-warning-dialog/multiselect-warning-dialog.component';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteListComponent {
  @Input() favorites: Favorites[];
  @Input() userId: string;
  @Input() selectedListEntryId: string;

  @Select(FavoritesState.getFavoriteListEntryList)
  favoriteListEntryList$: Observable<{ [favoriteListId: string]: any[] }>;
  @Select(FavoritesState.getFavoriteListEntries)
  favoriteListEntries$: Observable<{ [favoritesListId: string]: any }>;
  @Select(FavoritesState.getCurrentlyLoadingListIds)
  currentlyLoadingListIds$: Observable<string[]>;

  selectedFavoriteListId: string;
  selectedEntriesToDelete: number[] = [];

  exportLimit: number = 500;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private favoritesService: FavoritesService,
    private exportService: ExportService,
    private snackbar: ColidMatSnackBarService
  ) {}

  get entityType() {
    return Constants.Metadata.EntityType;
  }

  itemSelected(item): boolean {
    return item['EntryId'][0] === this.selectedListEntryId;
  }

  itemLabel(item): string {
    return item[Constants.Metadata.HasLabel].outbound[0].value;
  }

  refreshSelectedEntry() {
    this.store.dispatch(new ResetEntryDetailsMetadata());
  }

  resetSelectedFavoriteListId(favoriteListId: string) {
    if (this.selectedFavoriteListId === favoriteListId) {
      this.selectedFavoriteListId = '';
    }
  }

  fetchFavoriteListEntries(favoritesListId: string) {
    this.store.dispatch([
      new FetchFavoriteListEntries(this.userId, favoritesListId)
    ]);
    this.selectedFavoriteListId = favoritesListId;
    this.selectedEntriesToDelete = [];
  }

  editFavoriteList(event, favoritesListId: string, favoritesListName: string) {
    this.dialog.open(EditFavoriteListComponent, {
      width: '400px',
      height: '250px',
      data: {
        userId: this.userId,
        name: favoritesListName,
        id: favoritesListId
      }
    });
    event.stopPropagation();
  }

  deleteFavorite(event, favoritesListId: string, favoritesListName: string) {
    this.dialog
      .open(DeleteFavoriteListComponent, {
        width: '400px',
        data: {
          userId: this.userId,
          name: favoritesListName,
          id: favoritesListId
        }
      })
      .afterClosed()
      .subscribe((deleted) => {
        if (deleted) {
          this.store.dispatch(new FetchFavorites(this.userId));
        }
      });
    event.stopPropagation();
  }

  checkboxChanged(event: any, item) {
    const entryId = item['EntryId'][0];
    if (event.checked) {
      this.selectedEntriesToDelete.push(entryId);
    } else {
      this.selectedEntriesToDelete = this.selectedEntriesToDelete.filter(
        (id) => entryId !== id
      );
    }
  }

  entryListExists(
    favoriteListEntries: { [favoritesListId: string]: any[] },
    favoriteListId: string
  ): boolean {
    let proof = typeof favoriteListEntries[favoriteListId] !== 'undefined';
    if (proof) {
      return favoriteListEntries[favoriteListId].length > 0;
    }
    return proof;
  }

  removeSelectedEntries(event) {
    this.dialog
      .open(RemoveFavoriteEntryComponent, {
        width: '400px'
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.favoritesService
            .removeFavoriteListEntries(
              this.userId,
              this.selectedEntriesToDelete
            )
            .pipe(
              tap((_) => {
                this.store.dispatch([
                  new FetchFavorites(this.userId),
                  new ResetEntryDetailsMetadata()
                ]);
              })
            )
            .subscribe();
        }
      });
    event.stopPropagation();
  }

  openEntryInfo(favoriteListId: string, item) {
    const favoriteEntryId = item['EntryId'][0];
    const pidUri = item[Constants.Metadata.HasPidUri]['outbound'][0].value;
    const personalNote = item['PersonalNote'][0];
    this.store.dispatch(
      new SetEntryDetailsMetadata(
        favoriteListId,
        favoriteEntryId,
        pidUri,
        personalNote
      )
    );
  }

  startExportFavoriteList(event, favId: string) {
    const res = this.favorites.find((x) => x.id == favId);
    if (res.favoritesListEntries.length <= this.exportLimit) {
      const pidUris = res.favoritesListEntries.map((x) => x.pidUri);
      const dialogRef = this.dialog.open(ExportDialogComponent, {
        width: '50vw'
      });
      dialogRef
        .afterClosed()
        .pipe(
          switchMap((exportSettings: ExportSettings) => {
            if (exportSettings) {
              const payload =
                this.exportService.getExportSelectedResultsPayload(
                  exportSettings,
                  pidUris
                );
              return this.exportService.startExcelExport(payload).pipe(
                tap((_) => {
                  this.snackbar.successCustomDuration(
                    'Export started',
                    'Your export has been started. It could take some minutes, until the download link will appear in your notifications',
                    null,
                    5000
                  );
                })
              );
            }
            return EMPTY;
          })
        )
        .subscribe();
    } else {
      this.dialog.open(MultiselectWarningDialogComponent, {
        width: '500px',
        data: {
          dialogTitle: 'Export Warning!',
          dialogContent: `
            This favorite list cannot be exported because it contains more than 500 results.
            <br />
            Please refine your list to less than 500 elements.`
        }
      });
    }
    event.stopPropagation();
  }
}
