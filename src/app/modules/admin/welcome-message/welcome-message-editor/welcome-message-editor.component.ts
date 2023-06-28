import { Component, OnInit, OnDestroy } from "@angular/core";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { WelcomeMessage } from "src/app/shared/models/welcome-message";
import { Store, Select } from "@ngxs/store";
import {
  WelcomeMessageState,
  UpdateWelcomeMessageEditor,
} from "src/app/states/welcome-message.state";
import { Observable, Subscription } from "rxjs";
import { EntityFormStatus } from "src/app/shared/models/entity-form.status";

@Component({
  selector: "app-welcome-message-editor",
  templateUrl: "./welcome-message-editor.component.html",
  styleUrls: ["./welcome-message-editor.component.css"],
})
export class WelcomeMessageEditorComponent implements OnInit, OnDestroy {
  @Select(WelcomeMessageState.getWelcomeMessageEditor)
  welcomeMessageEditor$: Observable<WelcomeMessage>;

  status: EntityFormStatus = EntityFormStatus.INITIAL;
  welcomeMessageEditorSubscription: Subscription;
  welcomeMessageEditorDefault: WelcomeMessage;

  msg_header_editor = "Welcome Message Editor";
  error_general = "An error occured during welcome message processing";
  success_msg_update = "Message has been updated successfully";

  constructor(
    private store: Store,
    private snackBar: ColidMatSnackBarService
  ) {}

  ngOnInit() {
    this.welcomeMessageEditorSubscription =
      this.welcomeMessageEditor$.subscribe((res) => {
        if (res != null) {
          this.welcomeMessageEditorDefault = res;
        }
      });
  }

  ngOnDestroy() {
    this.welcomeMessageEditorSubscription.unsubscribe();
  }

  // Editor
  updateWelcomeMessageEditor(message: string) {
    this.status = EntityFormStatus.LOADING;

    this.store.dispatch(new UpdateWelcomeMessageEditor(message)).subscribe(
      (_) => {
        this.status = EntityFormStatus.SUCCESS;
        this.snackBar.success(this.msg_header_editor, this.success_msg_update);
      },
      (_) => {
        this.status = EntityFormStatus.ERROR;
        this.snackBar.error(this.msg_header_editor, this.error_general);
      }
    );
  }
}
