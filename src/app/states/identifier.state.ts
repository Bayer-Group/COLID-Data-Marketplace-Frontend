import { State, Action, StateContext, Selector } from "@ngxs/store";
import { IdentifierApiService } from "src/app/core/http/identifier.api.service";
import { tap } from "rxjs/operators";
import { IdentifierResultDTO } from "src/app/shared/models/identifier/identifier-result-dto";
import { Injectable } from "@angular/core";

export class FetchOrphanedIdentifiers {
  static readonly type = "[Identifier] Fetch orphaned";
  constructor() {}
}

export class DeleteOrphanedIdentifier {
  static readonly type = "[Identifier] Delete orphaned";
  constructor(public payload: string) {}
}

export class IdentifierStateModel {
  identifiers: IdentifierResultDTO[];
  identifier: IdentifierResultDTO;
  loading: boolean;
}
@State<IdentifierStateModel>({
  name: "identifier",
  defaults: {
    identifiers: null,
    identifier: null,
    loading: true,
  },
})
@Injectable()
export class IdentifierState {
  constructor(private identifierApiService: IdentifierApiService) {}

  @Selector()
  public static getIdentifiers(state: IdentifierStateModel) {
    return state.identifiers;
  }

  @Selector()
  public static getIdentifier(state: IdentifierStateModel) {
    return state.identifier;
  }

  @Selector()
  public static getIsLoading(state: IdentifierStateModel) {
    return state.loading;
  }

  @Action(FetchOrphanedIdentifiers)
  fetchOrphanedIdentifiers(
    { patchState }: StateContext<IdentifierStateModel>,
    {}: FetchOrphanedIdentifiers
  ) {
    patchState({
      identifiers: null,
      loading: true,
    });

    return this.identifierApiService.getOrphanedIdentifiers().pipe(
      tap((res) => {
        patchState({
          identifiers: res.map((str) => new IdentifierResultDTO(str)),
          loading: false,
        });
      })
    );
  }

  @Action(DeleteOrphanedIdentifier)
  deleteOrphanedIdentifier(_, { payload }: DeleteOrphanedIdentifier) {
    return this.identifierApiService.deleteOrphanedIdentifier(payload).pipe();
  }
}
