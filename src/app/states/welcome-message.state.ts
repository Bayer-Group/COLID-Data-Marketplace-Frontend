import { Injectable } from "@angular/core";
import { Selector, State, StateContext, Action } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { WelcomeMessageApiService } from "../core/http/welcome-message.api.service";
import { WelcomeMessage } from "../shared/models/welcome-message";

export class FetchWelcomeMessageDataMarketplace {
  static readonly type =
    "[WelcomeMessage] Fetch welcome message datamarketplace";
  constructor() {}
}

export class FetchWelcomeMessageEditor {
  static readonly type = "[WelcomeMessage] Fetch welcome message editor";
  constructor() {}
}

export class UpdateWelcomeMessageDataMarketplace {
  static readonly type =
    "[WelcomeMessage] Update welcome message datamarketplace";
  constructor(public str: string) {}
}

export class UpdateWelcomeMessageEditor {
  static readonly type = "[WelcomeMessage] Update welcome message editor";
  constructor(public str: string) {}
}

export class WelcomeMessageStateModel {
  welcomeMessageEditor: WelcomeMessage;
  welcomeMessageDataMarketplace: WelcomeMessage;
}

@State<WelcomeMessageStateModel>({
  name: "WelcomeMessage",
  defaults: {
    welcomeMessageEditor: null,
    welcomeMessageDataMarketplace: null,
  },
})
@Injectable()
export class WelcomeMessageState {
  constructor(private welcomeMessageApiService: WelcomeMessageApiService) {}

  @Selector()
  public static getWelcomeMessageEditor(state: WelcomeMessageStateModel) {
    return state.welcomeMessageEditor;
  }

  @Selector()
  public static getWelcomeMessageDataMarketplace(
    state: WelcomeMessageStateModel
  ) {
    return state.welcomeMessageDataMarketplace;
  }

  @Action(FetchWelcomeMessageEditor)
  fetchWelcomeMessageEditor({
    patchState,
  }: StateContext<WelcomeMessageStateModel>) {
    return this.welcomeMessageApiService.getWelcomeMessageEditor().pipe(
      tap((res: WelcomeMessage) => {
        patchState({
          welcomeMessageEditor: res,
        });
      })
    );
  }

  @Action(FetchWelcomeMessageDataMarketplace)
  fetchWelcomeMessageDataMarketplace({
    patchState,
  }: StateContext<WelcomeMessageStateModel>) {
    return this.welcomeMessageApiService
      .getWelcomeMessageDataMarketplace()
      .pipe(
        tap((res: WelcomeMessage) => {
          patchState({
            welcomeMessageDataMarketplace: res,
          });
        })
      );
  }

  @Action(UpdateWelcomeMessageEditor)
  UpdateWelcomeMessageEditor(
    ctx: StateContext<WelcomeMessageStateModel>,
    action: UpdateWelcomeMessageEditor
  ) {
    return this.welcomeMessageApiService
      .updateWelcomeMessageEditor(action.str)
      .pipe(
        tap((res: WelcomeMessage) => {
          ctx.patchState({
            welcomeMessageEditor: res,
          });
        })
      );
  }

  @Action(UpdateWelcomeMessageDataMarketplace)
  updateWelcomeMessageDataMarketplace(
    ctx: StateContext<WelcomeMessageStateModel>,
    action: UpdateWelcomeMessageDataMarketplace
  ) {
    return this.welcomeMessageApiService
      .updateWelcomeMessageDataMarketplace(action.str)
      .pipe(
        tap((res: WelcomeMessage) => {
          ctx.patchState({
            welcomeMessageDataMarketplace: res,
          });
        })
      );
  }
}
