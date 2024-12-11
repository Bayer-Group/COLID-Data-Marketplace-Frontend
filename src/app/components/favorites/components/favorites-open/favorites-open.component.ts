import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SearchResultComponent } from 'src/app/components/search-result/search-result.component';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { Favorites } from 'src/app/shared/models/favorites';
import { SearchHit } from 'src/app/shared/models/search-result';
import { MetadataState } from 'src/app/states/metadata.state';
import { SidebarState } from 'src/app/states/sidebar.state';
import {
  FavoritesState,
  FetchFavorites,
  ResetEntryDetailsMetadata,
  SaveFavoriteListEntry
} from '../../favorites.state';
import { CreateFavoriteListComponent } from '../create-favorite-list/create-favorite-list.component';

@Component({
  selector: 'colid-favorites-open',
  templateUrl: './favorites-open.component.html',
  styleUrls: [
    '../favorite-list.component.scss',
    './favorites-open.component.scss'
  ]
})
export class FavoritesOpenComponent implements OnInit, OnDestroy {
  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;
  @Select(FavoritesState.getFavoriteListEntries)
  favoriteListEntries$: Observable<{ [favoritesListId: string]: any }>;
  @Select(FavoritesState.getFavoriteListEntryList)
  favoriteListEntryList$: Observable<{ [favoriteListId: string]: any[] }>;
  @Select(FavoritesState.getFavorites) favorites$: Observable<Favorites[]>;
  @Select(FavoritesState.getSelectedEntry) selectedEntry$: Observable<{
    favoriteListId: string;
    favoriteEntryId: string;
    pidUri: string;
    personalNote: string;
  }>;
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;

  @ViewChild('res')
  searchResultComponent: SearchResultComponent;

  @Input() set user(id: string) {
    if (id != null) {
      this.userId = id;
      this.fetchFavorites();
    }
  }

  sub: Subscription = new Subscription();
  name: string;
  userId: string;
  pidUri: string;
  favoritesListId: string;
  favoritesListEntryId: string;
  personalNote: string;
  EntryId: string;
  favoriteListEntries: { [favoritesListId: string]: any };
  favoriteListEntryList: { [favoriteListId: string]: any[] };
  metadata: any = null;
  hit: SearchHit = null;
  loading: boolean = true;
  editNote: boolean = false;
  openedPanels: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private store: Store,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.selectedEntry$.subscribe((r) => {
        this.pidUri = r.pidUri;
        this.favoritesListEntryId = r.favoriteEntryId;
        this.favoritesListId = r.favoriteListId;
        this.personalNote = r.personalNote;
        this.loadEntryInfo(r.favoriteListId, r.pidUri);
      })
    );

    this.sub.add(
      this.authService.currentUserId$.subscribe((uid) => (this.userId = uid))
    );
    if (this.userId) {
      this.fetchFavorites();
    }
    this.sub.add(this.favorites$.subscribe((_) => {}));

    this.sub.add(
      this.favoriteListEntries$.subscribe((f) => {
        this.favoriteListEntries = f;
        this.loadEntryInfo(this.favoritesListId, this.pidUri);
      })
    );
    this.sub.add(
      this.favoriteListEntryList$.subscribe((f) => {
        this.favoriteListEntryList = f;
      })
    );

    this.sub.add(
      this.metadata$.subscribe((m) => {
        this.metadata = m;
        this.loading = false;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.store.dispatch(new ResetEntryDetailsMetadata());
  }

  fetchFavorites() {
    this.store.dispatch(new FetchFavorites(this.userId));
  }

  loadEntryInfo(favoriteListId: string, pidUri: string) {
    if (
      this.favoriteListEntries &&
      this.favoriteListEntries[favoriteListId] &&
      this.favoriteListEntries[favoriteListId][pidUri]
    ) {
      var sourceClone = JSON.parse(
        JSON.stringify(this.favoriteListEntries[favoriteListId][pidUri])
      );
      delete sourceClone.EntryId;
      delete sourceClone.PersonalNote;
      var result = {
        id: pidUri,
        score: 0,
        source: sourceClone,
        highlight: {},
        index: '',
        innerHits: {},
        matchedQueries: [],
        nested: null,
        primaryTerm: null,
        routing: null,
        sequenceNumber: null,
        sorts: [],
        type: '_doc',
        version: 0
      };

      this.hit = result;
      this.loading = false;
    }
  }

  createFavoriteList() {
    this.dialog.open(CreateFavoriteListComponent, {
      width: '400px',
      height: '250px'
    });
  }

  saveFavoriteListEntry(
    personalNote: string,
    favoriteListId: string,
    favoriteListEntryId: string,
    pidUri: string
  ) {
    this.store.dispatch(
      new SaveFavoriteListEntry(
        this.userId,
        favoriteListId,
        favoriteListEntryId,
        pidUri,
        personalNote
      )
    );
    this.toggleEdit();
  }

  /** Toggle personal note edit mode  */
  toggleEdit() {
    this.editNote = !this.editNote;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
