import { Component, Inject, Input } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { FavoriteListEntry, Favorites } from 'src/app/shared/models/favorites';
import {
  FavoritesState,
  FetchFavorites,
  SaveFavoriteListEntry
} from '../../favorites.state';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

@Component({
  selector: 'colid-edit-favorite-entry',
  templateUrl: './edit-favorite-entry.component.html',
  styleUrls: ['../favorite-list.component.scss']
})

//TODO: To be removed since it is unused
export class EditFavoriteEntryComponent {
  @Select(FavoritesState.getFavorites) favorites$: Observable<Favorites[]>;
  @Select(FavoritesState.getFavoriteListEntries)
  favoriteListEntries$: Observable<{
    [favoritesListId: string]: FavoriteListEntry[];
  }>;

  @Input() set user(id: string) {
    if (id != null) {
      this.userId = id;
      this.fetchFavorites();
    }
  }

  userId: string;
  pidUri: string;
  favoritesListId: string;
  favoritesListEntryId: string;
  personalNote: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditFavoriteEntryComponent>,
    private authService: AuthService,
    private snackBar: ColidMatSnackBarService,
    private store: Store
  ) {
    this.authService.currentUserId$.subscribe((uid) => (this.userId = uid));
    this.favoritesListEntryId = data.id;
    this.personalNote = data.personalNote;
    this.pidUri = data.pidUri;
    this.favoritesListId = data.favListId;
  }

  fetchFavorites() {
    this.store.dispatch(new FetchFavorites(this.userId));
  }

  editFavoriteEntry() {
    this.store.dispatch(
      new SaveFavoriteListEntry(
        this.userId,
        this.favoritesListId,
        this.favoritesListEntryId,
        this.pidUri,
        this.personalNote
      )
    );
    this.snackBar.success('Note updated', 'This resource updated.');
    this.dialogRef.close();
  }
}
