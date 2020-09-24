import { Selector, State, StateContext, Action } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { UserDto } from '../shared/models/user/user-dto';
import { of } from 'rxjs';
import { ColidEntrySubscriptionDto } from '../shared/models/user/colid-entry-subscription-dto';
import { UserInfoApiService } from '../core/http/user-info.api.service';
import { SearchFilterDataMarketplaceDto } from '../shared/models/user/search-filter-data-marketplace-dto';
import { MessageConfigDto } from '../shared/models/user/message-config-dto';

export class FetchUser {
    static readonly type = '[User] Fetch User';
    constructor(public id: string, public emailAddress: string) { }
}

export class ReloadUser {
  static readonly type = '[User] Reload User';
  constructor() { }
}

export class SetLastLoginDataMarketplace {
    static readonly type = '[User] Select Last Login DataMarketplace';
    constructor() { }
}

export class SetMessageConfig {
  static readonly type = '[User] Set MessageConfig';
  constructor(public messageConfig: MessageConfigDto) { }
}

export class AddColidEntrySubscription {
    static readonly type = '[ColidEntrySubscription] Add Colid Entry Subscription';
    constructor(public colidEntrySubscriptionDto: ColidEntrySubscriptionDto) { }
}

export class RemoveColidEntrySubscription {
    static readonly type = '[ColidEntrySubscription] Remove Colid Entry Subscription';
    constructor(public colidEntrySubscriptionDto: ColidEntrySubscriptionDto) { }
}

export class AddSearchFilterDataMarketplace {
    static readonly type = '[SearchFilterDataMarketplace] Add Search Filter DataMarketplace';
    constructor(public searchFilterDataMarketplaceDto: SearchFilterDataMarketplaceDto) { }
}

export class CreateDefaultSearchFilterDataMarketplace {
    static readonly type = '[SearchFilterDataMarketplace] Create Default SearchFilter DataMarketplace';
    constructor(public searchFilterDataMarketplaceDto: SearchFilterDataMarketplaceDto) { }
}

export class UserInfoStateModel {
    user: UserDto;
}

@State<UserInfoStateModel>({
    name: 'UserInfo',
    defaults: {
        user: null
    }
})

export class UserInfoState {
    constructor(private userInfoApiService: UserInfoApiService) { }

    @Selector()
    public static getMessageConfig(state: UserInfoStateModel) {
        return state.user.messageConfig;
    }

    @Selector()
    public static getColidEntrySubscriptions(state: UserInfoStateModel) {
        return state.user.colidEntrySubscriptions;
    }

    @Selector()
    public static getDefaultSearchFilterDataMarketplace(state: UserInfoStateModel) {
        if(state.user.defaultSearchFilterDataMarketplace != null) {
            return state.user.searchFiltersDataMarketplace.filter(dto => dto.id === state.user.defaultSearchFilterDataMarketplace)[0];
        }

        return null;
    }

    @Action(FetchUser)
    fetchUser({ patchState }: StateContext<UserInfoStateModel>, { id, emailAddress }: FetchUser) {
        return this.userInfoApiService.getUser(id)
            .pipe(
                tap((res: UserDto) => {
                    patchState({
                        user: res
                    });
                }),
                catchError(err => {
                    if (err.status === 404) {
                        return this.userInfoApiService.createUser(id, emailAddress).pipe(tap((res: UserDto) => {
                            patchState({
                                user: res
                            });
                        }))
                    }
                    else {
                        return of(null);
                    }
                })
            );
    }

    @Action(ReloadUser)
    reloadUser(ctx: StateContext<UserInfoStateModel>, action: ReloadUser) {
        const user = ctx.getState().user
        ctx.dispatch(new FetchUser(user.id, user.emailAddress)).subscribe();
    }

    @Action(SetLastLoginDataMarketplace)
    SetLastLoginDataMarketplace({ getState, patchState }: StateContext<UserInfoStateModel>, { }: SetLastLoginDataMarketplace) {
        const user = getState().user;
        const loginDate = new Date();
        if(user != null) {
            return this.userInfoApiService.setLastLoginDataMarketplace(user.id, loginDate).pipe(
                tap(res =>
                    patchState({
                        user: res
                    }))
            );
        }
    }

    @Action(SetMessageConfig)
    SetMessageConfig({ patchState, getState }: StateContext<UserInfoStateModel>, { messageConfig }: SetMessageConfig) {
        const user = getState().user;
        return this.userInfoApiService.setMessageConfig(user.id, messageConfig).pipe(tap((res: UserDto) => {
            patchState({
                user: res
            });
        }));
    }

    @Action(AddColidEntrySubscription)
    AddColidEntrySubscription({ patchState, getState }: StateContext<UserInfoStateModel>, { colidEntrySubscriptionDto }: AddColidEntrySubscription) {
        const user = getState().user;
        return this.userInfoApiService.addColidEntrySubscription(user.id, colidEntrySubscriptionDto).pipe(tap((res: UserDto) => {
            patchState({
                user: res
            });
        }));
    }

    @Action(RemoveColidEntrySubscription)
    RemoveColidEntrySubscription({ patchState, getState }: StateContext<UserInfoStateModel>, { colidEntrySubscriptionDto }: RemoveColidEntrySubscription) {
        const user = getState().user;
        return this.userInfoApiService.removeColidEntrySubscription(user.id, colidEntrySubscriptionDto).pipe(tap((res: UserDto) => {
            patchState({
                user: res
            });
        }));
    }

    @Action(AddSearchFilterDataMarketplace)
    AddSearchFilterDataMarketplace({ patchState, getState }: StateContext<UserInfoStateModel>, { searchFilterDataMarketplaceDto }: AddSearchFilterDataMarketplace) {
        const user = getState().user;
        return this.userInfoApiService.addSearchFilterDataMarketplace(user.id, searchFilterDataMarketplaceDto).pipe(tap((res: UserDto) => {
            patchState({
                user: res
            });
        }));
    }

    @Action(CreateDefaultSearchFilterDataMarketplace)
    CreateDefaultSearchFilterDataMarketplace({ patchState, getState }: StateContext<UserInfoStateModel>, { searchFilterDataMarketplaceDto }: CreateDefaultSearchFilterDataMarketplace) {
        const userId = getState().user.id;

        // First create a normal search filter for data marketplace
        return this.userInfoApiService.addSearchFilterDataMarketplace(userId, searchFilterDataMarketplaceDto).subscribe((userWithSearchFilter: UserDto) => {
            if(userWithSearchFilter != null) {
                patchState({
                    user: userWithSearchFilter
                });

                // Use the newly created search filter as default by comparing the latest name
                if(userWithSearchFilter.searchFiltersDataMarketplace != null && userWithSearchFilter.searchFiltersDataMarketplace.length > 0) {
                    let newSearchFilterDataMarketplace : any = userWithSearchFilter.searchFiltersDataMarketplace.filter(dto => dto.name === searchFilterDataMarketplaceDto.name)[0];

                    if(newSearchFilterDataMarketplace != null) {
                        return this.userInfoApiService.setDefaultSearchFilterDataMarketplace(userId, newSearchFilterDataMarketplace.id).subscribe((userWithDefaultSearchFilter: UserDto) => {
                            patchState({
                                user: userWithDefaultSearchFilter
                            });
                        });
                    }
                }
            }
        });
    }
}
