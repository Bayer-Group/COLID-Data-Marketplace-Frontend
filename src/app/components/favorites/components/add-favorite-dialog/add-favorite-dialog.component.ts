import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Select, Store } from "@ngxs/store";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "src/app/modules/authentication/services/auth.service";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { FavoriteListMetadata } from "src/app/shared/models/favorites";
import { FavoritesState, FetchFavorites } from "../../favorites.state";
import { FavoritesService } from "../../services/favorites.service";
import { CreateFavoriteListComponent } from "../create-favorite-list/create-favorite-list.component";
import { ClearSelectedPIDURIs, SearchState } from "src/app/states/search.state";

@Component({
  selector: "colid-add-favorite-dialog",
  templateUrl: "./add-favorite-dialog.component.html",
  styleUrls: [
    "../favorite-list.component.scss",
    "./add-favorite-dialog.component.scss",
  ],
})
export class AddFavoriteDialogComponent implements OnInit, OnDestroy {
  @Select(FavoritesState.getFavorites) favorites$: Observable<
    FavoriteListMetadata[]
  >;
  @Select(FavoritesState.getFavoriteUrisToListMapping)
  uriMappings$: Observable<{ [pidUri: string]: string[] }>;
  @Select(SearchState.getSelectedPIDURIs) selectedPIDURIs$: Observable<
    string[]
  >;

  sub: Subscription = new Subscription();
  userId: string;
  favorites: FavoriteListMetadata[] = [];
  selectedFavoriteListIds: string[] = [];
  previousFavoriteListIds: string[] = [];
  selectedPIDURIs: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private favoritesService: FavoritesService,
    private dialogRef: MatDialogRef<AddFavoriteDialogComponent>,
    private authService: AuthService,
    private snackBar: ColidMatSnackBarService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.authService.currentUserId$.subscribe(
        (userId) => (this.userId = userId)
      )
    );
    this.sub.add(
      this.favorites$.subscribe((favorites) => {
        this.favorites = favorites;
      })
    );
    if (this.data.multiSelect) {
      this.sub.add(
        this.selectedPIDURIs$.subscribe(
          (pidUris) => (this.selectedPIDURIs = pidUris)
        )
      );
    }
    if (this.data.pidUri) {
      this.sub.add(
        this.uriMappings$.subscribe((m) => {
          if (m[this.data.pidUri] != null) {
            this.previousFavoriteListIds = m[this.data.pidUri];
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkboxChanged(event, id: string) {
    event.checked
      ? this.selectedFavoriteListIds.push(id)
      : (this.selectedFavoriteListIds = this.selectedFavoriteListIds.filter(
          (x) => x !== id
        ));
  }

  createFavoriteList() {
    this.dialog.open(CreateFavoriteListComponent);
  }

  addFavorite() {
    if (this.data.multiSelect) {
      let favoriteListPayload: any[] = [];
      for (let i = 0; i < this.selectedPIDURIs.length; i++) {
        for (let j = 0; j < this.selectedFavoriteListIds.length; j++) {
          const favoriteListEntries = this.favorites.find(
            (fav) => fav.id === this.selectedFavoriteListIds[j]
          );
          if (
            favoriteListEntries.favoritesListEntries.every(
              (entry) => entry.pidUri !== this.selectedPIDURIs[i]
            )
          ) {
            favoriteListPayload.push({
              favoritesListId: this.selectedFavoriteListIds[j],
              pidUri: this.selectedPIDURIs[i],
              personalNote: "",
            });
          }
        }
      }
      if (favoriteListPayload.length === 0) {
        this.snackBar.info(
          "Favorites already added",
          "These resources have been already added to the selected favorite lists"
        );
        this.store.dispatch(new ClearSelectedPIDURIs());
        this.dialogRef.close;
        return;
      }

      // need to batch requests, as we otherwise get a 413 error
      const numberOfIterations = Math.round(favoriteListPayload.length / 50);
      for (let i = 0; i <= numberOfIterations; i++) {
        const currPayload = favoriteListPayload.slice(i * 50, (i + 1) * 50);
        this.favoritesService
          .addFavoriteEntries(this.userId, currPayload)
          .subscribe(() => {
            if (i === numberOfIterations) {
              this.snackBar.success(
                "Favorite added",
                "Selected resources have been marked as favorite."
              );
              this.store.dispatch(new FetchFavorites(this.userId));
              this.store.dispatch(new ClearSelectedPIDURIs());
              this.dialogRef.close;
            }
          });
      }
    } else {
      let favoriteListPayload: any[] = [];
      for (let i = 0; i < this.selectedFavoriteListIds.length; i++) {
        const favoriteListEntries = this.favorites.find(
          (fav) => fav.id === this.selectedFavoriteListIds[i]
        );
        if (
          favoriteListEntries.favoritesListEntries.every(
            (entry) => entry.pidUri !== this.data.pidUri
          )
        ) {
          favoriteListPayload.push({
            favoritesListId: this.selectedFavoriteListIds[i],
            pidUri: this.data.pidUri,
            personalNote: "",
          });
        }
      }

      if (favoriteListPayload.length === 0) {
        this.snackBar.info(
          "Favorites already added",
          "This resource has been already added to the selected favorite lists"
        );
        this.dialogRef.close;
        return;
      }

      this.favoritesService
        .addFavoriteEntries(this.userId, favoriteListPayload)
        .subscribe(() => {
          this.snackBar.success(
            "Favorite added",
            "This resource has been mark as favorite."
          );
          this.store.dispatch(new FetchFavorites(this.userId));
          this.dialogRef.close;
        });
    }
  }
}
