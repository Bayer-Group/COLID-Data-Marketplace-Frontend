import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";

export class SetFromRRM {
    static readonly type = '[Route] Set fromRRM flag';
    constructor(public fromRRM: boolean) { }
}

export class SetFilterMode {
    static readonly type = '[Route] Set filter mode';
    constructor(public filterMode: boolean){}
}

export class SetSourceDialog {
    static readonly type = "[Route] Set Source Dialog";
    constructor(public sourceDialog: string){}
}

export interface RRMStateModel {
    fromRRM: boolean;
    filterMode: boolean;
    sourceDialog: string;
}

@State<RRMStateModel>({
    name: 'route',
    defaults: {
        fromRRM: false,
        filterMode: false,
        sourceDialog: 'addResource'
    }
})
@Injectable()
export class RRMState {
    @Selector()
    public static getFromRRM(state: RRMStateModel): boolean {
        return state.fromRRM;
    }

    @Selector()
    public static getFilterMode(state: RRMStateModel): boolean {
        return state.filterMode;
    }

    @Selector()
    public static getSourceDialog(state: RRMStateModel): string {
        return state.sourceDialog;
    }

    @Action(SetFromRRM)
    setFromRRM({patchState}: StateContext<RRMStateModel>, {fromRRM}: SetFromRRM) {
        patchState({
            fromRRM: fromRRM
        });
    }

    @Action(SetFilterMode)
    setFilterMode({patchState}: StateContext<RRMStateModel>, {filterMode}: SetFilterMode) {
        patchState({
            filterMode: filterMode
        });
    }

    @Action(SetSourceDialog)
    setSourceDialog({patchState}: StateContext<RRMStateModel>, {sourceDialog}: SetSourceDialog) {
        patchState({
            sourceDialog: sourceDialog
        });
    }
}