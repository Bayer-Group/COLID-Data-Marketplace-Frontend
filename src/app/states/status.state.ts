import { Selector, State, StateContext, Action } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { StatusBuildInformationDto } from "../shared/models/status/status-build-information-dto";
import { StatusApiService } from "../core/http/status.api.service";
import { Injectable } from "@angular/core";

export class FetchBuildInformation {
  static readonly type = "[BuildInformation] Fetch buildInformation";
  constructor() {}
}

export class FetchReleaseNotes {
  static readonly type = "[ReleaseNotes] Fetching release notes";
  constructor() {}
}

export class StatusStateModel {
  buildInformation: StatusBuildInformationDto;
  releaseNotes: string;
}

@State<StatusStateModel>({
  name: "status",
  defaults: {
    buildInformation: null,
    releaseNotes: null,
  },
})
@Injectable()
export class StatusState {
  constructor(private statusApiService: StatusApiService) {}

  @Selector()
  public static getBuildInformation(state: StatusStateModel) {
    return state.buildInformation;
  }

  @Selector()
  public static getReleaseNotes(state: StatusStateModel) {
    return state.releaseNotes;
  }

  @Action(FetchBuildInformation)
  FetchBuildInformation(
    { patchState }: StateContext<StatusStateModel>,
    {}: FetchBuildInformation
  ) {
    return this.statusApiService.getBuildInformation().pipe(
      tap((res: StatusBuildInformationDto) => {
        patchState({
          buildInformation: res,
        });
      })
    );
  }

  @Action(FetchReleaseNotes)
  FetchReleaseNotes(
    { patchState }: StateContext<StatusStateModel>,
    {}: FetchReleaseNotes
  ) {
    return this.statusApiService.getReleaseNotes().pipe(
      tap((res: string) => {
        patchState({
          releaseNotes: res,
        });
      })
    );
  }
}
