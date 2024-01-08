import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import {
  AddSearchFilterDataMarketplace,
  AddStoredQueryToSearchFiltersDataMarketplace,
  UserInfoState,
} from "src/app/states/user-info.state";
import { ActiveRangeFilters } from "src/app/shared/models/active-range-filters";
import { SearchFilterDataMarketplaceDto } from "src/app/shared/models/user/search-filter-data-marketplace-dto";
import { SearchFilterCollectionDto } from "src/app/shared/models/user/search-filter-collection-dto";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { StoredQueryDto } from "src/app/shared/models/user/stored-query-dto";

export interface DialogData {
  searchText: string;
  activeRangeFilters: ActiveRangeFilters;
  activeAggregationFilters: Map<string, string[]>;
}

@Component({
  selector: "app-search-filter-dialog",
  templateUrl: "./search-filter-dialog.component.html",
  styleUrls: ["./search-filter-dialog.component.scss"],
})
export class SearchFilterDialogComponent implements OnInit {
  filterData: DialogData;
  searchFilterName: string;
  selectedSubscriptionValue: any;
  sendIntervals: string[] = ["Daily", "Weekly", "Monthly", "- -"];
  loading: boolean = false;
  lastCreatedSavedSearchPidUri: string = "";

  constructor(
    public dialogRef: MatDialogRef<SearchFilterDialogComponent>,
    private snackBar: ColidMatSnackBarService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.filterData = data;
  }

  ngOnInit() {
    this.selectedSubscriptionValue = "- -";
    this.searchFilterName = `Search saved at ${
      new Date().toISOString().slice(0, -5) + "Z"
    }`;
  }

  addSearchFilter() {
    this.loading = true;
    const newSearchFilter = new SearchFilterDataMarketplaceDto(
      this.searchFilterName,
      this.filterData.searchText,
      new SearchFilterCollectionDto(
        this.filterData.activeAggregationFilters,
        this.filterData.activeRangeFilters
      )
    );

    this.store
      .dispatch(new AddSearchFilterDataMarketplace(newSearchFilter))
      .subscribe((_) => {
        const userSearchFilters = this.store.selectSnapshot(
          UserInfoState.getUserSearchFilters
        );
        this.lastCreatedSavedSearchPidUri =
          userSearchFilters.slice(-1)[0].pidUri;

        this.snackBar.success(
          "Search Saved",
          "The selected search has been saved."
        );
        if (this.selectedSubscriptionValue != "- -") {
          const storedQuery = new StoredQueryDto(
            this.selectedSubscriptionValue,
            0
          );

          this.store.dispatch(
            new AddStoredQueryToSearchFiltersDataMarketplace(storedQuery)
          );
        }
        this.loading = false;
      });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
