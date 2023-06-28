export interface ResourceReview {
  pidUri: string;
  resourceName: string;
  resourceType: string;
  reviewDueDate: Date;
  dataSteward: string[];
  brokenDistributionEndpointsCount: number;
  brokenContactsCount: number;
  reviewCycle: number;
  lastReviewer: string;
  resourceReviewed: boolean;
  currentlyLoading: boolean;
}
