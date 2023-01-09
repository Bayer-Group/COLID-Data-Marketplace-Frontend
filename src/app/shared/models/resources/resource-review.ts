export interface ResourceReview {
    pidUri: string;
    resourceName: string;
    resourceType: string;
    reviewDueDate: Date;
    dataSteward: string[];
    reviewCycle: number;
    lastReviewer: string;
    resourceReviewed: boolean;
    currentlyLoading: boolean;
}