import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { from } from "rxjs";
import { tap } from "rxjs/operators";
import { TaxonomyService } from "../core/http/taxonomy.api.service";
import { TaxonomyDTO } from "../shared/models/taxonomy-dto";

export class TaxonomyStateModel {
    taxonomyResults: Map<string, TaxonomyDTO[]>
}

export class FetchTaxonomyList {
    static readonly type = '[Taxonomy] Fetch taxonomy list';
    constructor(public type: string) {}
}

@State<TaxonomyStateModel>({
    name: 'Taxonomy',
    defaults: {
        taxonomyResults: new Map<string, TaxonomyDTO[]>()
    }
})
@Injectable()
export class TaxonomyState {

    constructor(private taxonomyService: TaxonomyService) {}

    @Selector()
    public static getTaxonomyList(state: TaxonomyStateModel) {
        return state.taxonomyResults;
    }

    @Action(FetchTaxonomyList)
    fetchTaxonomyList(ctx: StateContext<TaxonomyStateModel>, action: FetchTaxonomyList) {
        const taxonomyResults = ctx.getState().taxonomyResults;
        if (taxonomyResults.has(action.type)) {
          return from(taxonomyResults);
        }

        return this.taxonomyService.getTaxonomyList(action.type).pipe(
            tap((res: TaxonomyDTO[]) => {
                const newTaxonomyList = taxonomyResults;
                newTaxonomyList.set(action.type, res);
                ctx.patchState({
                  taxonomyResults: new Map<string, TaxonomyDTO[]>(newTaxonomyList),
                });
            })
        )
    }

}