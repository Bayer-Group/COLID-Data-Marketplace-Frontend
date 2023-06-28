import { Inject } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import { SearchFilterDataMarketplaceDto } from "src/app/shared/models/user/search-filter-data-marketplace-dto";
import { StoredQueryDto } from "src/app/shared/models/user/stored-query-dto";
import { AddStoredQueryToSearchFiltersDataMarketplace } from "src/app/states/user-info.state";
import { ColidMatSnackBarService } from "../../colid-mat-snack-bar/colid-mat-snack-bar.service";

@Component({
  selector: "app-interval-notification-diallog",
  templateUrl: "./interval-notification-diallog.component.html",
  styleUrls: ["./interval-notification-diallog.component.scss"],
})
export class IntervalNotificationDiallogComponent implements OnInit {
  searchFilterDataMarketplaceDto: SearchFilterDataMarketplaceDto;
  selectedSubscriptionValue: any;
  sendIntervals: string[] = ["Daily", "Weekly", "Monthly"];

  constructor(
    public dialogRef: MatDialogRef<IntervalNotificationDiallogComponent>,
    private snackBar: ColidMatSnackBarService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: SearchFilterDataMarketplaceDto
  ) {
    this.searchFilterDataMarketplaceDto = data;
  }

  ngOnInit(): void {
    var storedQuery = this.searchFilterDataMarketplaceDto.storedQuery;
    this.selectedSubscriptionValue = storedQuery
      ? storedQuery.executionInterval
      : "Daily";
  }

  addStoreQuery() {
    const storedQuery = new StoredQueryDto(
      this.selectedSubscriptionValue,
      this.searchFilterDataMarketplaceDto.id
    );
    this.dialogRef.close(
      this.store
        .dispatch(new AddStoredQueryToSearchFiltersDataMarketplace(storedQuery))
        .subscribe(() => {
          this.snackBar.success(
            "Added Subscription",
            "The selected search has been subscribed successfully."
          );
        })
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
