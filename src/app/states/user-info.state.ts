import { Selector, State, StateContext, Action, Store } from "@ngxs/store";
import { tap, catchError } from "rxjs/operators";
import { UserDto } from "../shared/models/user/user-dto";
import { of } from "rxjs";
import { ColidEntrySubscriptionDto } from "../shared/models/user/colid-entry-subscription-dto";
import { UserInfoApiService } from "../core/http/user-info.api.service";
import { SearchFilterDataMarketplaceDto } from "../shared/models/user/search-filter-data-marketplace-dto";
import { MessageConfigDto } from "../shared/models/user/message-config-dto";
import { FetchColidEntrySubscriptionNumbers } from "./colid-entry-subcriber-count.state";
import { StoredQueryDto } from "../shared/models/user/stored-query-dto";
import { Injectable } from "@angular/core";
import { Favorites } from "../shared/models/favorites";
import { ConsumerGroupApiService } from "../core/http/consumer-group.api.service";
import { ConsumerGroupResultDTO } from "../shared/models/consumerGroups/ConsumerGroupResultDTO";

export class FetchUser {
  static readonly type = "[User] Fetch User";
  constructor(public id: string, public emailAddress: string) {}
}

export class ReloadUser {
  static readonly type = "[User] Reload User";
  constructor() {}
}

export class SetLastLoginDataMarketplace {
  static readonly type = "[User] Select Last Login DataMarketplace";
  constructor() {}
}

export class SetMessageConfig {
  static readonly type = "[User] Set MessageConfig";
  constructor(public messageConfig: MessageConfigDto) {}
}

export class AddColidEntrySubscription {
  static readonly type =
    "[ColidEntrySubscription] Add Colid Entry Subscription";
  constructor(public colidEntrySubscriptionDto: ColidEntrySubscriptionDto) {}
}

export class RemoveColidEntrySubscription {
  static readonly type =
    "[ColidEntrySubscription] Remove Colid Entry Subscription";
  constructor(public colidEntrySubscriptionDto: ColidEntrySubscriptionDto) {}
}

export class AddColidEntryFavorite {
  static readonly type = "[ColidEntryFavorite] Add Colid Entry Favorite";
  constructor(public colidEntryFavorite: Favorites) {}
}

export class RemoveColidEntryFavorite {
  static readonly type = "[ColidEntryFavorite] Remove Colid Entry Favorite";
  constructor(public colidEntryFavorite: Favorites) {}
}

export class AddSearchFilterDataMarketplace {
  static readonly type =
    "[SearchFilterDataMarketplace] Add Search Filter DataMarketplace";
  constructor(
    public searchFilterDataMarketplaceDto: SearchFilterDataMarketplaceDto
  ) {}
}

export class CreateDefaultSearchFilterDataMarketplace {
  static readonly type =
    "[SearchFilterDataMarketplace] Create Default SearchFilter DataMarketplace";
  constructor(
    public searchFilterDataMarketplaceDto: SearchFilterDataMarketplaceDto
  ) {}
}

export class RemoveSearchFilterDataMarketplace {
  static readonly type =
    "[SearchFilterDataMarketplace] Remove SearchFilter DataMarketplace";
  constructor(
    public searchFilterDataMarketplaceDto: SearchFilterDataMarketplaceDto
  ) {}
}

export class FetchSearchFilterDataMarketplace {
  static readonly type =
    "[SearchFilterDataMarketplace] Fetch Search Filter Data Market place";
  constructor() {}
}

export class AddStoredQueryToSearchFiltersDataMarketplace {
  static readonly type = "[SearchFilterDataMarketplace] Add StoredQuery";
  constructor(public storedQueryDto: StoredQueryDto) {}
}
export class RemoveStoredQueryToSearchFiltersDataMarketplace {
  static readonly type = "[SearchFilterDataMarketplace] Remove StoredQuery";
  constructor(public searchFilterDataMarketplaceId: number) {}
}

export class FetchConsumerGroupsByUser {
  static readonly type = "[User] Fetch ConsumerGroups by user";
  constructor() {}
}

export class UserInfoStateModel {
  user: UserDto;
  consumerGroups: ConsumerGroupResultDTO[];
}

@State<UserInfoStateModel>({
  name: "UserInfo",
  defaults: {
    user: null,
    consumerGroups: null,
  },
})
@Injectable()
export class UserInfoState {
  constructor(
    private store: Store,
    private userInfoApiService: UserInfoApiService,
    private consumerGroupApi: ConsumerGroupApiService
  ) {}

  @Selector()
  public static getUser(state: UserInfoStateModel) {
    return state.user;
  }

  @Selector()
  public static getMessageConfig(state: UserInfoStateModel) {
    return state.user.messageConfig;
  }

  @Selector()
  public static getColidEntrySubscriptions(state: UserInfoStateModel) {
    return state.user.colidEntrySubscriptions;
  }

  @Selector()
  public static getDefaultSearchFilterDataMarketplace(
    state: UserInfoStateModel
  ) {
    if (state.user.defaultSearchFilterDataMarketplace != null) {
      return state.user.searchFiltersDataMarketplace.filter(
        (dto) => dto.id === state.user.defaultSearchFilterDataMarketplace
      )[0];
    }

    return null;
  }

  @Selector()
  public static getUserSearchFilters(state: UserInfoStateModel) {
    if (state.user.searchFiltersDataMarketplace != null) {
      return state.user.searchFiltersDataMarketplace;
    }

    return null;
  }

  @Selector()
  public static getConsumerGroups(state: UserInfoStateModel) {
    return state.consumerGroups;
  }

  @Action(FetchUser)
  fetchUser(
    { patchState }: StateContext<UserInfoStateModel>,
    { id, emailAddress }: FetchUser
  ) {
    return this.userInfoApiService.getUser(id).pipe(
      tap((res: UserDto) => {
        patchState({
          user: res,
        });
      }),
      catchError((err) => {
        if (err.status === 404) {
          return this.userInfoApiService.createUser(id, emailAddress).pipe(
            tap((res: UserDto) => {
              patchState({
                user: res,
              });
            })
          );
        }
        return of(null);
      })
    );
  }

  @Action(ReloadUser)
  reloadUser(ctx: StateContext<UserInfoStateModel>) {
    const user = ctx.getState().user;
    ctx.dispatch(new FetchUser(user.id, user.emailAddress)).subscribe();
  }

  @Action(SetLastLoginDataMarketplace)
  SetLastLoginDataMarketplace(
    { getState, patchState }: StateContext<UserInfoStateModel>,
    {}: SetLastLoginDataMarketplace
  ) {
    const user = getState().user;
    if (user != null) {
      // only for first login of current user and it's creation
      const loginDate = new Date();
      return this.userInfoApiService
        .setLastLoginDataMarketplace(user.id, loginDate)
        .pipe(
          tap((res) => {
            user.lastLoginDataMarketplace = res.lastLoginDataMarketplace;
            patchState({
              user: user,
            });
          })
        );
    }
  }

  @Action(SetMessageConfig)
  SetMessageConfig(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    { messageConfig }: SetMessageConfig
  ) {
    const user = getState().user;
    return this.userInfoApiService
      .setMessageConfig(user.id, messageConfig)
      .pipe(
        tap((res: UserDto) => {
          user.messageConfig = res.messageConfig;
          patchState({
            user: user,
          });
        })
      );
  }

  @Action(AddColidEntrySubscription)
  AddColidEntrySubscription(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    { colidEntrySubscriptionDto }: AddColidEntrySubscription
  ) {
    const user = getState().user;
    return this.userInfoApiService
      .addColidEntrySubscription(user.id, colidEntrySubscriptionDto)
      .pipe(
        tap((res: UserDto) => {
          user.colidEntrySubscriptions = res.colidEntrySubscriptions;
          patchState({
            user: user,
          });
          this.store.dispatch(new FetchColidEntrySubscriptionNumbers());
        })
      );
  }

  @Action(RemoveColidEntrySubscription)
  RemoveColidEntrySubscription(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    { colidEntrySubscriptionDto }: RemoveColidEntrySubscription
  ) {
    const user = getState().user;
    return this.userInfoApiService
      .removeColidEntrySubscription(user.id, colidEntrySubscriptionDto)
      .pipe(
        tap((res: UserDto) => {
          user.colidEntrySubscriptions = res.colidEntrySubscriptions;
          patchState({
            user: user,
          });
          this.store.dispatch(new FetchColidEntrySubscriptionNumbers());
        })
      );
  }

  @Action(AddSearchFilterDataMarketplace)
  AddSearchFilterDataMarketplace(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    { searchFilterDataMarketplaceDto }: AddSearchFilterDataMarketplace
  ) {
    const user = getState().user;
    return this.userInfoApiService
      .addSearchFilterDataMarketplace(user.id, searchFilterDataMarketplaceDto)
      .pipe(
        tap((res: UserDto) => {
          user.searchFiltersDataMarketplace = res.searchFiltersDataMarketplace;
          patchState({
            user: user,
          });
        })
      );
  }

  @Action(CreateDefaultSearchFilterDataMarketplace)
  CreateDefaultSearchFilterDataMarketplace(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    { searchFilterDataMarketplaceDto }: CreateDefaultSearchFilterDataMarketplace
  ) {
    const user = getState().user;

    // First create a normal search filter for data marketplace
    return this.userInfoApiService
      .addSearchFilterDataMarketplace(user.id, searchFilterDataMarketplaceDto)
      .subscribe((res: UserDto) => {
        if (res != null) {
          user.searchFiltersDataMarketplace = res.searchFiltersDataMarketplace;
          patchState({
            user: user,
          });

          // Use the newly created search filter as default by comparing the latest name
          if (
            res.searchFiltersDataMarketplace != null &&
            res.searchFiltersDataMarketplace.length > 0
          ) {
            let newSearchFilterDataMarketplace: any =
              res.searchFiltersDataMarketplace.filter(
                (dto) => dto.name === searchFilterDataMarketplaceDto.name
              )[0];

            if (newSearchFilterDataMarketplace != null) {
              return this.userInfoApiService
                .setDefaultSearchFilterDataMarketplace(
                  user.id,
                  newSearchFilterDataMarketplace.id
                )
                .subscribe((res: UserDto) => {
                  user.defaultSearchFilterDataMarketplace =
                    res.defaultSearchFilterDataMarketplace;
                  patchState({
                    user: user,
                  });
                });
            }
          }
        }
      });
  }

  @Action(RemoveSearchFilterDataMarketplace)
  RemoveSearchFilterDataMarketplace(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    { searchFilterDataMarketplaceDto }: RemoveSearchFilterDataMarketplace
  ) {
    const user = getState().user;
    return this.userInfoApiService
      .removeSearchFilterDataMarketplace(
        user.id,
        searchFilterDataMarketplaceDto.id
      )
      .pipe(
        tap((res: UserDto) => {
          user.searchFiltersDataMarketplace = res.searchFiltersDataMarketplace;
          patchState({
            user: user,
          });
        })
      );
  }

  @Action(FetchSearchFilterDataMarketplace)
  fetchSearchFilterDataMarketplace(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    {}: FetchSearchFilterDataMarketplace
  ) {
    var user = getState().user;
    return this.userInfoApiService
      .getSearchFiltersDataMarketplace(user.id)
      .pipe(
        tap((res: SearchFilterDataMarketplaceDto[]) => {
          user.searchFiltersDataMarketplace = res;
          patchState({
            user: user,
          });
        })
      );
  }

  @Action(AddStoredQueryToSearchFiltersDataMarketplace)
  AddStoredQueryToSearchFiltersDataMarketplace(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    { storedQueryDto }: AddStoredQueryToSearchFiltersDataMarketplace
  ) {
    const user = getState().user;
    if (storedQueryDto.searchFilterDataMarketplaceId == 0) {
      var length = user.searchFiltersDataMarketplace.length;
      storedQueryDto.searchFilterDataMarketplaceId =
        length > 0 ? user.searchFiltersDataMarketplace[length - 1].id : 0;
    }
    return this.userInfoApiService
      .addStoredQueryDataMarketplace(user.id, storedQueryDto)
      .pipe(
        tap((res: SearchFilterDataMarketplaceDto) => {
          const index = user.searchFiltersDataMarketplace.findIndex(
            (data) => data.id === res.id
          );
          user.searchFiltersDataMarketplace[index].storedQuery =
            res.storedQuery;
          patchState({
            user: user,
          });
        })
      );
  }

  @Action(RemoveStoredQueryToSearchFiltersDataMarketplace)
  RemoveStoredQueryToSearchFiltersDataMarketplace(
    { patchState, getState }: StateContext<UserInfoStateModel>,
    {
      searchFilterDataMarketplaceId,
    }: RemoveStoredQueryToSearchFiltersDataMarketplace
  ) {
    const user = getState().user;
    return this.userInfoApiService
      .removeStoredQueryDataMarketplace(user.id, searchFilterDataMarketplaceId)
      .pipe(
        tap((res: SearchFilterDataMarketplaceDto) => {
          var index = user.searchFiltersDataMarketplace.findIndex(
            (x) => x.id == res.id
          );
          if (index > -1) {
            user.searchFiltersDataMarketplace[index].storedQuery = null;
          }
          patchState({
            user: user,
          });
        })
      );
  }

  @Action(FetchConsumerGroupsByUser)
  fetchConsumerGroupsByUser(
    { patchState }: StateContext<UserInfoStateModel>,
    {}: FetchConsumerGroupsByUser
  ) {
    return this.consumerGroupApi.getActiveEntities().pipe(
      tap((consumerGroups: ConsumerGroupResultDTO[]) => {
        patchState({
          consumerGroups,
        });
      })
    );
  }
}
