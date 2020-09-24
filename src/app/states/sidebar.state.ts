import { State, Action, StateContext, Selector} from '@ngxs/store';

export class SetSidebarOpened {
    static readonly type = '[Sidebar] SetSidebarOpened';
    constructor(public payload: boolean) { }
  }

  export class SetSidebarMode {
    static readonly type = '[Sidebar] SetSidebarMode';
    constructor(public payload: string) { }
  }

  export class ClickedSidebarLink {
    static readonly type = '[Sidebar] ClickedSidebarLink';
  }

  export class ToggleSidebar {
    static readonly type = '[Sidebar] ToggleSidebar';
  }

export class SidebarStateModel {
  sidebarOpened: boolean;
  sidebarMode: string;
}

@State<SidebarStateModel>({
  name: 'sidebar',
  defaults: {
    sidebarOpened: true,
    sidebarMode: 'side'
  }
})

export class SidebarState {

  constructor() { }

  @Selector()
  public static sidebarOpened(state: SidebarStateModel) {
    return state.sidebarOpened;
  }

  @Selector()
  public static sidebarMode(state: SidebarStateModel) {
    return state.sidebarMode;
  }

  @Action(SetSidebarOpened)
  setSidebarOpened({ patchState }: StateContext<SidebarStateModel>, { payload }: SetSidebarOpened) {
    patchState({
      sidebarOpened: payload
    });
  }

  @Action(SetSidebarMode)
  setSidebarMode({ patchState }: StateContext<SidebarStateModel>, { payload }: SetSidebarMode) {
    patchState({
      sidebarMode: payload
    });
  }

  @Action(ClickedSidebarLink)
  clickedSidebarLink({ getState, patchState }: StateContext<SidebarStateModel>, { }: ClickedSidebarLink) {

    if (getState().sidebarMode === 'over') {
        patchState({
            sidebarOpened: false
          });
    }
  }

  @Action(ToggleSidebar)
  toggleSidebar({ getState, patchState }: StateContext<SidebarStateModel>, { }: ToggleSidebar) {

    patchState({
      sidebarOpened: !getState().sidebarOpened
    });
  }
}
