import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { NotificationDialogComponent } from "src/app/modules/notification/components/notification-dialog/notification-dialog.component";
import {
  DeleteNotification,
  FetchNotifications,
  NotificationState,
  ReadNotification,
  ReadNotifications,
} from "src/app/modules/notification/notification.state";
import { MessageDto } from "src/app/shared/models/user/message-dto";
import { UserDto } from "src/app/shared/models/user/user-dto";

@Component({
  selector: "app-notifications-tile",
  templateUrl: "./notifications-tile.component.html",
  styleUrls: ["./notifications-tile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsTileComponent {
  @Input() user: UserDto;
  @Select(NotificationState.getNotifications) notifications$: Observable<
    MessageDto[]
  >;

  constructor(private store: Store, private dialog: MatDialog) {}

  reloadNofications() {
    this.store.dispatch(new FetchNotifications(this.user.id));
  }

  openNotification(notification: MessageDto) {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      data: notification,
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.readNotification(notification);
    });
  }

  deleteNotification(notification: MessageDto) {
    this.store.dispatch(new DeleteNotification(this.user.id, notification.id));
  }

  readNotification(notification: MessageDto) {
    if (notification.readOn == null) {
      this.store.dispatch(new ReadNotification(this.user.id, notification.id));
    }
  }

  readNotifications(notifications: MessageDto[]) {
    if (notifications.some((n) => n.readOn != null)) {
      this.store.dispatch(new ReadNotifications(this.user.id, notifications));
    }
  }
}
