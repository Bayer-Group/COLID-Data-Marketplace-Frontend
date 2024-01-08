import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { SearchFilterDataMarketplaceDto } from "src/app/shared/models/user/search-filter-data-marketplace-dto";
import { UserInfoState } from "src/app/states/user-info.state";
import { InstructionsDialogComponent } from "../../instructions-dialog/instructions-dialog.component";

@Component({
  selector: "app-saved-searches-tile",
  templateUrl: "./saved-searches-tile.component.html",
  styleUrls: ["./saved-searches-tile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedSearchesTileComponent {
  @Select(UserInfoState.getUserSearchFilters) searchFilters$: Observable<
    SearchFilterDataMarketplaceDto[]
  >;

  constructor(private dialog: MatDialog) {}

  openInstructionsDialog(title: string, imageUrl: string) {
    this.dialog.open(InstructionsDialogComponent, {
      width: "1000px",
      data: {
        title,
        imageUrl,
      },
    });
  }
}
