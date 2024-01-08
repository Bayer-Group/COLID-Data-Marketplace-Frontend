import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { Constants } from "src/app/shared/constants";
import { SearchFilterDataMarketplaceDto } from "src/app/shared/models/user/search-filter-data-marketplace-dto";
import {
  AddSearchFilterDataMarketplace,
  UserInfoState,
} from "src/app/states/user-info.state";

interface DialogData {
  search: SearchFilterDataMarketplaceDto;
}

@Component({
  selector: "app-create-browsable-uri-dialog",
  templateUrl: "./create-browsable-uri-dialog.component.html",
  styleUrls: ["./create-browsable-uri-dialog.component.scss"],
})
export class CreateBrowsableUriDialogComponent {
  loading: boolean = false;
  createdPidUri: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store,
    private snackbar: ColidMatSnackBarService
  ) {}

  getAggregationLabel(filterKey: string) {
    let filterKeyLabel =
      this.getKeyByValue(Constants.Metadata, filterKey) ?? "";
    return filterKeyLabel;
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  createBrowsableUri() {
    this.loading = true;
    this.store
      .dispatch(new AddSearchFilterDataMarketplace(this.data.search))
      .subscribe((_) => {
        const userSearchFilters = this.store.selectSnapshot(
          UserInfoState.getUserSearchFilters
        );
        this.createdPidUri =
          userSearchFilters.find(
            (searchFilter) => searchFilter.id == this.data.search.id
          )?.pidUri ?? "";
        this.snackbar.success(
          "Browsable URI created",
          "A browsable URI has been created for this search."
        );
        this.loading = false;
      });
  }
}
