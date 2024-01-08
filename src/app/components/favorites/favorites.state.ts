import { Injectable } from "@angular/core";
import { Selector, State, StateContext, Action } from "@ngxs/store";
import { patch, removeItem, updateItem } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import {
  FavoriteListEntry,
  FavoriteListMetadata,
} from "src/app/shared/models/favorites";
import { FavoritesService } from "./services/favorites.service";
import { Constants } from "src/app/shared/constants";

export class FetchFavorites {
  static readonly type = "[Favorite] Fetch favorites";
  constructor(public userId: string) {}
}

export class FetchFavoriteListEntries {
  static readonly type = "[Favorite] Fetch favorite list entries";
  constructor(public userId: string, public favoritesListId: string) {}
}

export class DeleteFavorite {
  static readonly type = "[Favorite] Delete favorite";
  constructor(public userId: string, public id: string) {}
}

/** Remove an entry from the favorites list */
export class RemoveEntry {
  static readonly type = "[Favorite] Remove Item";
  constructor(
    public userId: string,
    public pidUri: string,
    public favoriteListId: string,
    public favoritesListEntryId: string
  ) {}
}

export class SaveFavoriteListEntry {
  static readonly type = "[Favorite] Save favorite list entry";
  constructor(
    public userId: string,
    public favoriteListId: string,
    public favoriteListEntryId: string,
    public pidUri: string,
    public personalNote: string
  ) {}
}

export class SaveFavoriteList {
  static readonly type = "[Favorite] Save favorite list";
  constructor(
    public usedId: string,
    public favoriteListId: string,
    public name: string
  ) {}
}

export class SetEntryDetailsMetadata {
  static readonly type = "[Favorite] Show entry details";
  constructor(
    public favoritesListId: string,
    public favoriteEntryId: string,
    public pidUri: string,
    public personalNote: string
  ) {}
}

export class ResetEntryDetailsMetadata {
  static readonly type = "[Favorite] Reset selected entry";
  constructor() {}
}

export class FavoritesStateModel {
  favorites: FavoriteListMetadata[]; /** Contains a list of all favorite lists */
  favoriteListEntries: {
    [favoritesListId: string]: any;
  }; /** Containts a mapping favorite list id -> List of all its entries with metadata */
  favoriteListEntryList: { [favoritesListId: string]: any[] };
  currentlyLoadingListIds: string[];
  selectedEntry: {
    favoriteListId: string;
    favoriteEntryId: string;
    pidUri: string;
    personalNote: string;
  };
}

@State<FavoritesStateModel>({
  name: "Favorites",
  defaults: {
    favorites: [],
    favoriteListEntries: {},
    favoriteListEntryList: {},
    currentlyLoadingListIds: [],
    selectedEntry: {
      favoriteListId: "0",
      favoriteEntryId: "0",
      pidUri: "",
      personalNote: "",
    },
  },
})
@Injectable()
export class FavoritesState {
  constructor(
    private favoritesApiService: FavoritesService,
    private snackbar: ColidMatSnackBarService
  ) {}

  @Selector()
  public static getFavorites(
    state: FavoritesStateModel
  ): FavoriteListMetadata[] {
    return state.favorites;
  }

  @Selector()
  public static getFavoriteListEntries(state: FavoritesStateModel): {
    [favoritesListId: string]: FavoriteListEntry[];
  } {
    return state.favoriteListEntries;
  }

  private static getUriList(listMetadata: FavoriteListMetadata[]): string[] {
    let uris: string[] = [];
    listMetadata.forEach((f) => {
      f.favoritesListEntries.forEach((e) => {
        uris.push(e.pidUri);
      });
    });
    return [...new Set(uris)]; //remove duplicates
  }

  /** Return a list of all PID URIs which are currently in some favorite list*/
  @Selector()
  public static getFavoriteUriList(state: FavoritesStateModel): string[] {
    return this.getUriList(state.favorites);
  }

  /** Return a dictionary with a mapping pid uri -> favorite lists
   *
   * Will be used to see in which favorite lists a certain PID URI is contained
   */
  @Selector()
  public static getFavoriteUrisToListMapping(state: FavoritesStateModel): {
    [pidUri: string]: string[];
  } {
    let mapping: { [pidUri: string]: string[] } = {};
    var uris = this.getUriList(state.favorites);
    uris.forEach((u) => {
      mapping[u] = state.favorites
        .filter(
          (f) => f.favoritesListEntries.findIndex((e) => e.pidUri == u) > -1
        )
        .map((f) => f.id);
    });

    return mapping;
  }

  @Selector()
  public static getFavoriteListEntryList(state: FavoritesStateModel): {
    [favoritesListId: string]: any[];
  } {
    return state.favoriteListEntryList;
  }

  @Selector()
  public static getSelectedEntry(state: FavoritesStateModel): {
    favoriteListId: string;
    pidUri: string;
  } {
    return state.selectedEntry;
  }

  @Selector()
  public static getCurrentlyLoadingListIds(
    state: FavoritesStateModel
  ): string[] {
    return state.currentlyLoadingListIds;
  }

  @Action(FetchFavorites)
  FetchFavorites(
    { patchState }: StateContext<FavoritesStateModel>,
    action: FetchFavorites
  ) {
    return this.favoritesApiService
      .getFavorites(action.userId)
      .pipe(
        tap((res: FavoriteListMetadata[]) => {
          patchState({
            favorites: res,
          });
        })
      )
      .subscribe();
  }

  @Action(SetEntryDetailsMetadata)
  SetEntryDetailsMetadata(
    { patchState }: StateContext<FavoritesStateModel>,
    action: SetEntryDetailsMetadata
  ) {
    patchState({
      selectedEntry: {
        pidUri: action.pidUri,
        favoriteListId: action.favoritesListId,
        favoriteEntryId: action.favoriteEntryId,
        personalNote: action.personalNote,
      },
    });
  }

  @Action(ResetEntryDetailsMetadata)
  ResetSelectedEntry({ patchState }: StateContext<FavoritesStateModel>) {
    patchState({
      selectedEntry: {
        favoriteListId: "0",
        favoriteEntryId: "0",
        pidUri: "",
        personalNote: "",
      },
    });
  }

  @Action(FetchFavoriteListEntries)
  FetchFavoriteListEntries(
    ctx: StateContext<FavoritesStateModel>,
    action: FetchFavoriteListEntries
  ) {
    let currentlyLoading = [...ctx.getState().currentlyLoadingListIds];
    if (currentlyLoading.indexOf(action.favoritesListId) === -1) {
      currentlyLoading.push(action.favoritesListId);
    }

    ctx.patchState({ currentlyLoadingListIds: currentlyLoading });

    this.favoritesApiService
      .getFavoritesListDetails(action.userId, action.favoritesListId)
      .pipe(
        tap((res: { [pidUri: string]: any }) => {
          let tmp = ctx.getState().favoriteListEntries;
          tmp[action.favoritesListId] = res;
          let tmpList: { [listId: string]: any[] } =
            ctx.getState().favoriteListEntryList;
          tmpList[action.favoritesListId] = [];
          Object.keys(res).forEach((k) => {
            var elems = res[k];
            tmpList[action.favoritesListId].push(elems);
          });

          const newCurrentlyLoadingList = [
            ...ctx.getState().currentlyLoadingListIds,
          ].filter((x) => x !== action.favoritesListId);

          ctx.patchState({
            favoriteListEntries: tmp,
            favoriteListEntryList: tmpList,
            currentlyLoadingListIds: newCurrentlyLoadingList,
          });
        })
      )
      .subscribe();
  }

  @Action(SaveFavoriteList)
  SaveFavoriteList(
    ctx: StateContext<FavoritesStateModel>,
    action: SaveFavoriteList
  ) {
    var payload = { name: action.name };

    return this.favoritesApiService
      .editFavoritesList(action.usedId, action.favoriteListId, payload)
      .subscribe({
        next: (_) => {
          this.snackbar.success(
            "Favorite List updated",
            "This list was successfully updated."
          );
          ctx.setState(
            patch<FavoritesStateModel>({
              favorites: updateItem<FavoriteListMetadata>(
                (f) => f.id == action.favoriteListId,
                patch<FavoriteListMetadata>({
                  name: action.name,
                })
              ),
            })
          );
        },
        error: () => {
          this.snackbar.warning("Failed to save", "Failed to save the list");
        },
      });
  }

  @Action(DeleteFavorite)
  DeleteFavorite(
    ctx: StateContext<FavoritesStateModel>,
    action: DeleteFavorite
  ) {
    return this.favoritesApiService
      .deleteFavoriteList(action.userId, action.id)
      .pipe(
        tap((_) => {
          ctx.setState(
            patch({
              favorites: patch(
                removeItem<FavoriteListMetadata>((f) => f.id == action.id)
              ),
            })
          );
        })
      )
      .subscribe();
  }

  /**
   * Remove an entry from a favorites list and patch the state
   * @param ctx State - will be populated automatically
   * @param action State action type
   * @returns
   */
  @Action(RemoveEntry)
  RemoveEntry(ctx: StateContext<FavoritesStateModel>, action: RemoveEntry) {
    return this.favoritesApiService
      .removeFavoriteListEntry(action.userId, action.favoritesListEntryId)
      .pipe(
        tap((_) => {
          var updatedDocumentsItem =
            ctx.getState().favoriteListEntries[action.favoriteListId];
          delete updatedDocumentsItem[action.pidUri];
          ctx.setState(
            patch<FavoritesStateModel>({
              favorites: updateItem<FavoriteListMetadata>(
                (f) => f.id == action.favoriteListId,
                patch<FavoriteListMetadata>({
                  favoritesListEntries: removeItem(
                    (m) => m.id == action.favoritesListEntryId
                  ),
                })
              ),
              favoriteListEntries: patch({
                [action.favoriteListId]: patch({
                  ...updatedDocumentsItem,
                }),
              }),
              favoriteListEntryList: patch({
                [action.favoriteListId]: removeItem<any>(
                  (e) =>
                    e[Constants.Metadata.HasPidUri]["outbound"][0].value ==
                    action.pidUri
                ),
              }),
            })
          );
        })
      )
      .subscribe();
  }

  @Action(SaveFavoriteListEntry)
  SaveEntry(
    ctx: StateContext<FavoritesStateModel>,
    action: SaveFavoriteListEntry
  ) {
    var payload = { personalNote: action.personalNote };

    return this.favoritesApiService
      .editFavoritesListEntry(
        action.userId,
        action.favoriteListEntryId,
        payload
      )
      .subscribe((_) => {
        var updatedPersonalNote = { PersonalNote: [action.personalNote] };

        ctx.setState(
          patch({
            favoriteListEntries: patch({
              [action.favoriteListId]: patch({
                [action.pidUri]: patch(updatedPersonalNote),
              }),
            }),
            favoriteListEntryList: patch({
              [action.favoriteListId]: updateItem<any>(
                (e) => e.EntryId[0] == action.favoriteListEntryId,
                patch(updatedPersonalNote)
              ),
            }),
          })
        );

        ctx.setState(
          patch({
            selectedEntry: patch({
              personalNote: action.personalNote,
            }),
          })
        );
      });
  }
}
