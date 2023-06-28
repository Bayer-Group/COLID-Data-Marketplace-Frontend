import { Selector, State, StateContext, Action } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { StatusBuildInformationDto } from "../shared/models/status/status-build-information-dto";
import { StatusApiService } from "../core/http/status.api.service";
import { Injectable } from "@angular/core";

export class FetchBuildInformation {
  static readonly type = "[BuildInformation] Fetch buildInformation";
  constructor() {}
}

export class StatusStateModel {
  buildInformation: StatusBuildInformationDto;
}

@State<StatusStateModel>({
  name: "status",
  defaults: {
    buildInformation: null,
  },
})
@Injectable()
export class StatusState {
  constructor(private statusApiService: StatusApiService) {}

  @Selector()
  public static getBuildInformation(state: StatusStateModel) {
    return state.buildInformation;
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
}
