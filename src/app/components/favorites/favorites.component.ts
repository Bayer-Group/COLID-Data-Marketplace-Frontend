import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Select, Store } from "@ngxs/store";
import {
  FavoritesState,
  FetchFavoriteListEntries,
  FetchFavorites,
  SetEntryDetailsMetadata,
} from "./favorites.state";
import { FavoriteListEntry, Favorites } from "src/app/shared/models/favorites";
import { DeleteFavoriteListComponent } from "./components/delete-favorite-list/delete-favorite-list.component";
import { RemoveFavoriteEntryComponent } from "./components/remove-favorite-entry/remove-favorite-entry.component";
import { EditFavoriteEntryComponent } from "./components/edit-favorite-entry/edit-favorite-entry.component";
import { Router } from "@angular/router";
import { CreateFavoriteListComponent } from "./components/create-favorite-list/create-favorite-list.component";
import { EditFavoriteListComponent } from "./components/edit-favorite-list/edit-favorite-list.component";
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: "colid-favorites",
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit, OnDestroy {
  @Select(FavoritesState.getFavoriteListEntries)
  favoriteListEntries$: Observable<{
    [favoritesListId: string]: FavoriteListEntry[];
  }>;
  @Select(FavoritesState.getFavorites) favorites$: Observable<Favorites[]>;
  currentlyLoadingListIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  masterSub: Subscription = new Subscription();

  @Input() set user(id: string) {
    if (id != null) {
      this.userId = id;
      this.fetchFavorites();
    }
  }
  @Input() set sidebarOpen(open: boolean) {
    if (open) {
      this.fetchFavorites();
    }
  }

  label = Constants.Metadata.HasLabel

  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();

  name: string;
  userId: string;
  favoritesListId: string;
  favoritesListEntryId: string;
  personalNote: string;
  EntryId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private router: Router,
    private store: Store,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      this.fetchFavorites();
    }
    this.masterSub.add(
      this.store.select(state => state.Favorites.currentlyLoadingListIds).subscribe(loadingListIds => this.currentlyLoadingListIds$.next(loadingListIds))
    );
  }

  ngOnDestroy(): void {
    this.masterSub.unsubscribe();
  }

  fetchFavorites() {
    this.store.dispatch(new FetchFavorites(this.userId));
  }

  fetchFavoriteListEntries(favoritesListId: string) {
    this.store.dispatch(
      new FetchFavoriteListEntries(this.userId, favoritesListId)
    );
  }

  openFavoritesFullscreen() {
    this.closeSidebar.emit();
    this.router.navigate(["/favorites"]);
  }

  openFavoritesPage(
    favoriteListId: string,
    favoriteEntryId: string,
    pidUri: string,
    personalNote: string
  ) {
    this.router.navigate(["/favorites"]);
    if (this.router.navigate) {
      this.store.dispatch(
        new SetEntryDetailsMetadata(
          favoriteListId,
          favoriteEntryId,
          pidUri,
          personalNote
        )
      );
      this.closeSidebar.emit();
    }
  }

  createFavoriteList() {
    this.dialog.open(CreateFavoriteListComponent);
  }

  editFavoriteList(favoritesListId: string, favoritesListName: string) {
    this.dialog.open(EditFavoriteListComponent, {
      width: "400px",
      height: "400px",
      data: {
        name: favoritesListName,
        id: favoritesListId,
      },
    });
  }

  editFavoriteEntry(
    favoritesListEntryId: any,
    favoriteListId: string,
    pidUri: string
  ) {
    this.dialog.open(EditFavoriteEntryComponent, {
      width: "400px",
      height: "400px",
      data: {
        personalNote: favoritesListEntryId.PersonalNote[0],
        id: favoritesListEntryId.EntryId[0],
        pidUri: pidUri,
        favListId: favoriteListId,
      },
    });
  }

  deleteFavorite(favoritesListId: string, favoritesListName: string) {
    this.dialog.open(DeleteFavoriteListComponent, {
      width: "400px",
      height: "400px",
      data: {
        name: favoritesListName,
        id: favoritesListId,
      },
    });
  }

  removeEntry(
    favoriteListId: string,
    pidUri: string,
    favoriteListEntryDocument: any
  ) {
    this.dialog.open(RemoveFavoriteEntryComponent, {
      width: "400px",
      height: "400px",
      data: {
        id: favoriteListEntryDocument.EntryId[0],
        favoriteListId: favoriteListId,
        pidUri: pidUri,
      },
    });
  }

  entryListExists(
    favoriteListEntries: { [favoritesListId: string]: FavoriteListEntry[] },
    favoriteListId: string
  ): boolean {
    var proof = typeof favoriteListEntries[favoriteListId] !== "undefined";
    if (proof) {
      return Object.keys(favoriteListEntries[favoriteListId]).length > 0;
    }
    return proof;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
