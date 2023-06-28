import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationComponent } from "./notification.component";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { TimeAgoPipe } from "./pipes/time-ago.pipe";
import { UTCToLocalTimePipe } from "./pipes/utc-to-local-time";
import { NotificationDialogComponent } from "./components/notification-dialog/notification-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgxsModule } from "@ngxs/store";
import { NotificationState } from "./notification.state";
import { HttpClientModule } from "@angular/common/http";
import { NotificationService } from "./services/notification.service";

@NgModule({
  declarations: [
    NotificationComponent,
    TimeAgoPipe,
    UTCToLocalTimePipe,
    NotificationDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgxsModule.forFeature([NotificationState]),
  ],
  providers: [NotificationService],
  exports: [NotificationComponent],
})
export class NotificationModule {
  static forRoot(): ModuleWithProviders<NotificationModule> {
    return {
      ngModule: NotificationModule,
      providers: [NotificationService],
    };
  }
}
