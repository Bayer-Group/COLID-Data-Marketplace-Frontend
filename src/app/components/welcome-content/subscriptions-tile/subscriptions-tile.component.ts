import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs/internal/Observable";
import { ColidEntrySubscriptionDetailsDto } from "src/app/shared/models/user/colid-entry-subscription-details-dto";
import { UserInfoState } from "src/app/states/user-info.state";
import { InstructionsDialogComponent } from "../../instructions-dialog/instructions-dialog.component";

@Component({
  selector: "app-subscriptions-tile",
  templateUrl: "./subscriptions-tile.component.html",
  styleUrls: ["./subscriptions-tile.component.scss"],
})
export class SubscriptionsTileComponent {
  @Select(UserInfoState.getLatestSubscriptions)
  latestSubscriptions$: Observable<ColidEntrySubscriptionDetailsDto[]>;
  @Select(UserInfoState.getMostSubscribedResources)
  mostSubscribedResources$: Observable<ColidEntrySubscriptionDetailsDto[]>;

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
