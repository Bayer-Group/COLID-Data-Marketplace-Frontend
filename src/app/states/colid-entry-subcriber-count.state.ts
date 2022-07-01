import { Selector, State, StateContext, Action, Store, Select } from '@ngxs/store';
import { ColidEntrySubscriptionDto } from '../shared/models/user/colid-entry-subscription-dto';
import { ColidEntryApiService } from '../core/http/colid-entries.api.service';
import { SearchState } from './search.state';
import { Injectable } from '@angular/core';
  
export class FetchColidEntrySubscriptionNumbers {
    static readonly type = '[ColidEntrySubscriptionNumbers] Fetch FetchColidEntrySubscriptionNumbers';
    constructor() { }
 }

export class ColidEntrySubscriberCountStateModel {
    loading: boolean;
    colidEntrySubscriptions: ColidEntrySubscriptionDto[];
}


@State<ColidEntrySubscriberCountStateModel>({
    name: 'ColidEntrySubscriptionNumbers',
    defaults: {
        loading:false,
        colidEntrySubscriptions: []
    }
})
@Injectable()
export class ColidEntrySubscriberCountState {
    constructor(private colidEntryApiService: ColidEntryApiService, private store: Store) {
    }
  
    @Selector()
    public static getSubscriptionNumbers(state: ColidEntrySubscriberCountStateModel) {
      return state.colidEntrySubscriptions;
    }
     
    @Action(FetchColidEntrySubscriptionNumbers)
    FetchColidEntrySubscriptionNumbers({ patchState }: StateContext<ColidEntrySubscriberCountStateModel>, {}: FetchColidEntrySubscriptionNumbers) {
        const pidUriList = this.store.selectSnapshot(SearchState.getSearchResult).hits.hits.map(x => decodeURIComponent(x.id));

        if (pidUriList != null && pidUriList.length > 0) {
            this.colidEntryApiService.getColidEntrySubscriptionCount(pidUriList).subscribe(cs => {
                patchState({
                        colidEntrySubscriptions: cs
                });
            });
        } else {
            patchState({
                colidEntrySubscriptions: []
            });
        }
    }
}