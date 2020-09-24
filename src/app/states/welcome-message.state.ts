import { Selector, State, StateContext, Action } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { WelcomeMessageApiService } from '../core/http/welcome-message.api.sevice';
import { WelcomeMessage } from '../shared/models/welcome-message';

export class FetchWelcomeMessage {
    static readonly type = '[WelcomeMessage] Fetch welcome message';
    constructor() { }
}

export class WelcomeMessageStateModel {
    welcomeMessage: WelcomeMessage;
}

@State<WelcomeMessageStateModel>({
    name: 'WelcomeMessage',
    defaults: {
        welcomeMessage: null
    }
})

export class WelcomeMessageState {

    constructor(private welcomeMessageApiService: WelcomeMessageApiService) { }

    @Selector()
    public static getWelcomeMessage(state: WelcomeMessageStateModel) {
        return state.welcomeMessage;
    }

    @Action(FetchWelcomeMessage) 
    FetchWelcomeMessage({ patchState }: StateContext<WelcomeMessageStateModel>, { }: FetchWelcomeMessage) {
        return this.welcomeMessageApiService.getWelcomeMessage().pipe(tap((res: WelcomeMessage) => {
            patchState({
                welcomeMessage: res
            });
        }));
    }

}