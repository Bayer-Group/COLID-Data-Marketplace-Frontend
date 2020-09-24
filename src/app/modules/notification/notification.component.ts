import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MessageDto } from 'src/app/shared/models/user/message-dto';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { NotificationState, FetchNotifications, DeleteNotification, ReadNotification, ReadNotifications } from './notification.state';

@Component({
  selector: 'colid-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Select(NotificationState.getNotifications) notifications$: Observable<MessageDto[]>;

  @Input() set user(id: string) {
    if (id != null) {
      this.userId = id;
      this.reloadNofications();
    }
  }
  @Input() set sidebarOpen(open: boolean) {
    if (open) {
      this.reloadNofications();
    }
  }

  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();

  userId: string;

  constructor(private store: Store, public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.userId) {
      this.reloadNofications();
    }
  }

  openNotification(notification: MessageDto) {
    const dialogRef = this.dialog.open(NotificationDialogComponent, { data: notification });

    dialogRef.afterClosed().subscribe(result => {
      this.readNotification(notification);
    });
  }

  readNotification(notification: MessageDto) {
    if (notification.readOn == null) {
      this.store.dispatch(new ReadNotification(this.userId, notification.id)).subscribe();
    }
  }

  readNotifications(notifications: MessageDto[]) {
    if (notifications.some(n => n.readOn != null)) {
      this.store.dispatch(new ReadNotifications(this.userId, notifications)).subscribe();
    }
  }

  deleteNotification(notification: MessageDto) {
    this.store.dispatch(new DeleteNotification(this.userId, notification.id)).subscribe();
  }

  reloadNofications() {
    this.store.dispatch(new FetchNotifications(this.userId)).subscribe();
  }
}
