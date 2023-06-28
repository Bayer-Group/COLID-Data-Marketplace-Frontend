import { Injectable } from "@angular/core";
import { Selector, State, StateContext, Action } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { MessageDto } from "src/app/shared/models/user/message-dto";
import { NotificationService } from "./services/notification.service";

export class FetchNotifications {
  static readonly type = "[Notification] Fetch notifications by user";
  constructor(public userId: string) {}
}

export class ReadNotification {
  static readonly type = "[Notification] Read notification";
  constructor(public userId: string, public id: string) {}
}

export class ReadNotifications {
  static readonly type = "[Notification] Read notifications";
  constructor(public userId: string, public notifications: MessageDto[]) {}
}

export class DeleteNotification {
  static readonly type = "[Notification] Delete notifications";
  constructor(public userId: string, public id: string) {}
}

export class NotificationStateModel {
  notifications: MessageDto[];
}

@State<NotificationStateModel>({
  name: "Notification",
  defaults: {
    notifications: null,
  },
})
@Injectable()
export class NotificationState {
  constructor(private notificationApiService: NotificationService) {}

  @Selector()
  public static getNotifications(state: NotificationStateModel) {
    return state.notifications.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    });
  }

  @Action(FetchNotifications)
  FetchNotifications(
    { patchState }: StateContext<NotificationStateModel>,
    action: FetchNotifications
  ) {
    return this.notificationApiService.getUserNotifications(action.userId).pipe(
      tap((res: MessageDto[]) => {
        patchState({
          notifications: res,
        });
      })
    );
  }

  @Action(ReadNotification)
  ReadNotification(
    { patchState, getState }: StateContext<NotificationStateModel>,
    action: ReadNotification
  ) {
    const filteredNotifications = getState().notifications.filter(
      (n) => n.id !== action.id
    );
    return this.notificationApiService
      .readNotification(action.userId, action.id)
      .pipe(
        tap((res: MessageDto) => {
          filteredNotifications.push(res);
          patchState({
            notifications: filteredNotifications,
          });
        })
      );
  }

  @Action(ReadNotifications)
  ReadNotifications(
    { patchState }: StateContext<NotificationStateModel>,
    action: ReadNotifications
  ) {
    const ids = action.notifications.map((n) => n.id);
    return this.notificationApiService
      .readNotifications(action.userId, ids)
      .pipe(
        tap((res: MessageDto[]) => {
          patchState({
            notifications: res,
          });
        })
      );
  }

  @Action(DeleteNotification)
  DeleteNotification(
    { patchState, getState }: StateContext<NotificationStateModel>,
    action: DeleteNotification
  ) {
    const filteredNotifications = getState().notifications.filter(
      (n) => n.id !== action.id
    );
    return this.notificationApiService
      .deleteNotification(action.userId, action.id)
      .pipe(
        tap((_) => {
          patchState({
            notifications: filteredNotifications,
          });
        })
      );
  }
}
