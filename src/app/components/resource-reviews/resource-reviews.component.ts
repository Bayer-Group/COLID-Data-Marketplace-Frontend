import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { ResourceApiService } from "src/app/core/http/resource.api.service";
import { Constants } from "src/app/shared/constants";
import { ResourceOverviewDTO } from "src/app/shared/models/resources/resource-overview-dto";
import { ResourceReview } from "src/app/shared/models/resources/resource-review";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { MatPaginator } from "@angular/material/paginator";
import { environment } from "src/environments/environment";
import { MatDialog } from "@angular/material/dialog";
import { LinkedResourceDisplayDialogComponent } from "../linked-resource-dialog/linked-resource-display-dialog.component";
import { Select, Store } from "@ngxs/store";
import { UserInfoState } from "src/app/states/user-info.state";
import { ConsumerGroupResultDTO } from "src/app/shared/models/consumerGroups/ConsumerGroupResultDTO";
import { AddReviewedResource, ReviewState } from "src/app/states/review.state";
import moment from "moment";

@Component({
  selector: "app-resource-reviews",
  templateUrl: "./resource-reviews.component.html",
  styleUrls: ["./resource-reviews.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceReviewsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Select(UserInfoState.getConsumerGroups) consumerGroups$: Observable<
    ConsumerGroupResultDTO[]
  >;
  @Select(ReviewState.getReviewedResourceIds) reviewedResourceIds$: Observable<
    string[]
  >;

  dataSource: MatTableDataSource<ResourceReview>;
  selectedConsumerGroupId: string;
  defaultConsumerGroup: string;
  selectedUTCDate: moment.Moment;
  currentUTCDate: number;

  reviewedResourceIds: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay = [
    "resourceName",
    "brokenDistributionEndpointsCount",
    "brokenContactsCount",
    "reviewDueDate",
    "dataSteward",
    "reviewCycle",
    "lastReviewer",
    "actionButtons",
  ];

  sub: Subscription = new Subscription();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private resourceService: ResourceApiService,
    private snackbar: ColidMatSnackBarService,
    private dialog: MatDialog,
    private store: Store
  ) {
    this.dataSource = new MatTableDataSource([]);
    const today = new Date();
    this.selectedUTCDate = moment().utcOffset(0).startOf("day").add(1, "M");
    this.currentUTCDate = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
  }

  ngOnInit(): void {
    this.sub.add(
      this.consumerGroups$.subscribe(
        (consumerGroups: ConsumerGroupResultDTO[]) => {
          if (consumerGroups && consumerGroups.length > 0) {
            this.selectedConsumerGroupId = consumerGroups[0].id;
            this.defaultConsumerGroup = consumerGroups[0].name;
            this.loadDueReviews();
          }
        }
      )
    );
    this.sub.add(
      this.reviewedResourceIds$.subscribe(
        (ids) => (this.reviewedResourceIds = ids)
      )
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadDueReviews() {
    this.isLoading$.next(true);
    this.resourceService
      .getDueReviews(
        this.selectedConsumerGroupId,
        this.selectedUTCDate.toISOString().substring(0, 10)
      )
      .pipe(
        map((result: ResourceOverviewDTO[]) =>
          result.map((review) => {
            return <ResourceReview>{
              pidUri: review.pidUri,
              resourceName: review.properties[Constants.Metadata.HasLabel][0],
              resourceType: review.properties[Constants.Metadata.EntityType][0],
              reviewDueDate: new Date(
                review.properties[Constants.Metadata.HasNextReviewDueDate]
              ),
              dataSteward:
                review.properties[Constants.Metadata.DataSteward] ?? [],
              reviewCycle: review.properties[
                Constants.Metadata.HasReviewCyclePolicy
              ]
                ? parseInt(
                    review.properties[
                      Constants.Metadata.HasReviewCyclePolicy
                    ][0]
                  )
                : -1,
              lastReviewer: review.properties[
                Constants.Metadata.HasLastReviewer
              ]
                ? review.properties[Constants.Metadata.HasLastReviewer][0]
                : "",
              resourceReviewed: this.reviewedResourceIds.some(
                (id) => id === review.pidUri
              ),
              brokenDistributionEndpointsCount:
                this.getBrokenDistributionEndpointsCount(review),
              brokenContactsCount: this.getBrokenContactsCount(review),
              currentlyLoading: this.getCurrentLoadingStatus(review.pidUri),
            };
          })
        )
      )
      .subscribe((reviews) => {
        this.dataSource.data = reviews;
        this.isLoading$.next(false);
      });
  }

  private getBrokenDistributionEndpointsCount(review: ResourceOverviewDTO) {
    if (!review.properties[Constants.Metadata.Distribution]) {
      return 0;
    }
    const distributionEndpoints = review.properties[
      Constants.Metadata.Distribution
    ].map((d) => d.properties);
    const brokenDistributionEndpointsCount = distributionEndpoints.filter(
      (p) => p[Constants.Metadata.HasBrokenDistributionEndpointLink]
    ).length;
    return brokenDistributionEndpointsCount;
  }

  private getBrokenContactsCount(review: ResourceOverviewDTO) {
    if (
      review.properties[Constants.Metadata.HasBrokenDataSteward] ===
        undefined &&
      review.properties[Constants.Metadata.Distribution] === undefined
    ) {
      return 0;
    } else if (
      review.properties[Constants.Metadata.Distribution] === undefined
    ) {
      return review.properties[Constants.Metadata.HasBrokenDataSteward].length;
    } else if (
      review.properties[Constants.Metadata.HasBrokenDataSteward] === undefined
    ) {
      const distributionEndpoints = review.properties[
        Constants.Metadata.Distribution
      ].map((d) => d.properties);
      const invalidDistributionEndpointContactsCount =
        distributionEndpoints.filter(
          (p) => p[Constants.Metadata.HasBrokenEndpointContact]
        ).length;
      return invalidDistributionEndpointContactsCount;
    } else {
      const invalidDataStewardsCount =
        review.properties[Constants.Metadata.HasBrokenDataSteward].length;
      const distributionEndpoints = review.properties[
        Constants.Metadata.Distribution
      ].map((d) => d.properties);
      const invalidDistributionEndpointContactsCount =
        distributionEndpoints.filter(
          (p) => p[Constants.Metadata.HasBrokenEndpointContact]
        ).length;
      return (
        invalidDataStewardsCount + invalidDistributionEndpointContactsCount
      );
    }
  }

  selectConsumerGroup(selectedConsumerGroupId: string) {
    this.selectedConsumerGroupId = selectedConsumerGroupId;
    this.loadDueReviews();
  }

  selectDate(event) {
    const selectedDate = event.value;
    this.selectedUTCDate = selectedDate;
    this.loadDueReviews();
  }

  isDateDue(date: Date) {
    let resourceDueDateUTC = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return resourceDueDateUTC < this.currentUTCDate;
  }

  showResourceDetails(pidUri: string) {
    this.dialog.open(LinkedResourceDisplayDialogComponent, {
      data: {
        id: pidUri,
        confirmReview: false,
      },
    });
  }

  editResource(pidUri: string) {
    const url = `${environment.pidUrl}/resource/edit?pidUri=${encodeURI(
      pidUri
    )}`;
    window.open(url, "_blank");
  }

  confirmReview(pidUri: string) {
    const dialogRef = this.dialog.open(LinkedResourceDisplayDialogComponent, {
      data: {
        id: pidUri,
        confirmReview: true,
      },
    });
    dialogRef.afterClosed().subscribe((reviewConfirmed) => {
      if (reviewConfirmed) {
        this.setLoadingStatusOfReview(pidUri, true);

        this.resourceService.confirmReview(pidUri).subscribe(
          (_) => {
            this.store.dispatch(new AddReviewedResource(pidUri));
            this.setLoadingStatusOfReview(pidUri, false);
            this.loadDueReviews();
            this.snackbar.success(
              "Review successful",
              "The resource was successfully reviewed"
            );
          },
          (_) => this.setLoadingStatusOfReview(pidUri, false)
        );
      }
    });
  }

  setLoadingStatusOfReview(pidUri: string, isLoading: boolean) {
    const dataSource = this.dataSource.data;
    dataSource.find((x) => x.pidUri === pidUri).currentlyLoading = isLoading;
    this.dataSource.data = dataSource;
  }

  getCurrentLoadingStatus(pidUri: string) {
    const dataSource = this.dataSource.data;
    if (dataSource && dataSource.length > 0) {
      return (
        dataSource.find((x) => x.pidUri === pidUri)?.currentlyLoading ?? false
      );
    }
    return false;
  }
}
