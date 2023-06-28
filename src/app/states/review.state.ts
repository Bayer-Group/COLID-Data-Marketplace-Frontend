import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";

export class AddReviewedResource {
  static readonly type = "[Resource Reviews] AddReviewedResource";
  constructor(public reviewedResourceId: string) {}
}

export class ReviewStateModel {
  reviewedResourcesIds: string[];
}

@State<ReviewStateModel>({
  name: "resourceReviews",
  defaults: {
    reviewedResourcesIds: [],
  },
})
@Injectable()
export class ReviewState {
  constructor() {}

  @Selector()
  public static getReviewedResourceIds(state: ReviewStateModel) {
    return state.reviewedResourcesIds;
  }

  @Action(AddReviewedResource)
  addReviewedResource(
    { getState, patchState }: StateContext<ReviewStateModel>,
    { reviewedResourceId }: AddReviewedResource
  ) {
    const reviewedResourcesIds = [...getState().reviewedResourcesIds];
    reviewedResourcesIds.push(reviewedResourceId);
    patchState({
      reviewedResourcesIds,
    });
  }
}
