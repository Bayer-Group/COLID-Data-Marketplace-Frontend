import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ResourceApiService } from "src/app/core/http/resource.api.service";
import { Constants } from "src/app/shared/constants";
import { ResourceOverviewDTO } from "src/app/shared/models/resources/resource-overview-dto";
import { ResourceReview } from "src/app/shared/models/resources/resource-review";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { MatPaginator } from "@angular/material/paginator";
import { environment } from "src/environments/environment";
import { MatDialog } from "@angular/material/dialog";
import { LinkedResourceDisplayDialog } from "../linked-resource-dialog/linked-resource-display-dialog.component";
import { Select, Store } from "@ngxs/store";
import { UserInfoState } from "src/app/states/user-info.state";
import { ConsumerGroupResultDTO } from "src/app/shared/models/consumerGroups/ConsumerGroupResultDTO";
import { AddReviewedResource, ReviewState } from "src/app/states/review.state";

@Component({
  selector: "app-resource-reviews",
  templateUrl: "./resource-reviews.component.html",
  styleUrls: ["./resource-reviews.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceReviewsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Select(UserInfoState.getConsumerGroups) consumerGroups$: Observable<ConsumerGroupResultDTO[]>;
  @Select(ReviewState.getReviewedResourceIds) reviewedResourceIds$: Observable<string[]>;

  dataSource: MatTableDataSource<ResourceReview>;
  selectedConsumerGroupId: string;
  defaultConsumerGroup: string;
  selectedUTCDate: Date;
  currentUTCDate: number;

  reviewedResourceIds: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay = [
    "resourceName",
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
    this.selectedUTCDate = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );
    this.selectedUTCDate.setMonth((this.selectedUTCDate.getMonth() + 1) % 12);
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
      this.reviewedResourceIds$
        .subscribe((ids) => (this.reviewedResourceIds = ids))
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
              reviewCycle: parseInt(
                review.properties[Constants.Metadata.HasReviewCyclePolicy][0]
              ),
              lastReviewer: review.properties[
                Constants.Metadata.HasLastReviewer
              ]
                ? review.properties[Constants.Metadata.HasLastReviewer][0]
                : "",
              resourceReviewed: this.reviewedResourceIds.some(
                (id) => id === review.pidUri
              ),
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

  selectConsumerGroup(selectedConsumerGroupId: string) {
    this.selectedConsumerGroupId = selectedConsumerGroupId;
    this.loadDueReviews();
  }

  selectDate(event) {
    const selectedDate = event.value;
    this.selectedUTCDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );
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
    this.dialog.open(LinkedResourceDisplayDialog, {
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
    const dialogRef = this.dialog.open(LinkedResourceDisplayDialog, {
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
