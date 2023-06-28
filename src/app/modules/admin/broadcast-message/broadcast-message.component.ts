import { Component, Input, OnInit } from "@angular/core";
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MessagesApiService } from "src/app/core/http/messages.api.service";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { DeleteItemDialogComponent } from "src/app/shared/components/delete-item-dialog/delete-item-dialog.component";
import { EntityFormStatus } from "src/app/shared/models/entity-form.status";
import { QuillEditorConfig } from "src/app/shared/constants";

@Component({
  selector: "app-broadcast-message",
  templateUrl: "./broadcast-message.component.html",
  styleUrls: ["./broadcast-message.component.scss"],
})
export class BroadcastMessageComponent implements OnInit {
  MESSAGE_ERROR = "Broadcast message could not be sent";
  MESSAGE_SENT = "Broadcast message has been sent";
  MESSAGE_RESET = "Broadcast message has been reset";

  @Input() headerMessage: string;

  editForm: UntypedFormGroup = null;
  quillEditorConfig = QuillEditorConfig;

  status: EntityFormStatus = EntityFormStatus.INITIAL;

  get isLoading(): boolean {
    return this.status === EntityFormStatus.LOADING;
  }

  constructor(
    private messagesApiService: MessagesApiService,
    public dialog: MatDialog,
    private snackBar: ColidMatSnackBarService
  ) {}

  ngOnInit() {
    this.editForm = new UntypedFormGroup({
      subjectControl: new UntypedFormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      bodyControl: new UntypedFormControl("", [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
    });
  }

  noWhitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  onSubmit() {
    // Impossible to reach without trigger the button click by code-hijacking
    if (!this.editForm.valid) {
      this.snackBar.error(this.headerMessage, "Illegal call detected.");
      this.status = EntityFormStatus.ERROR;
      return;
    }

    // Request user confirmation
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Send broadcast message`,
        body: `Are you sure you want to send the message to all users?`,
      },
      width: "auto",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sendMessageToAllUsers();
      } else {
        this.status = EntityFormStatus.INITIAL;
      }
    });
  }

  onReset() {
    if (
      this.editForm.controls["subjectControl"].value !== "" ||
      this.editForm.controls["bodyControl"].value !== ""
    ) {
      this.resetValues();
      this.snackBar.info(this.headerMessage, this.MESSAGE_RESET);
    }
  }

  resetValues() {
    this.editForm.controls["subjectControl"].setValue("");
    this.editForm.controls["bodyControl"].setValue("");
  }

  sendMessageToAllUsers() {
    this.status = EntityFormStatus.LOADING;

    const subject = this.editForm.controls["subjectControl"].value;
    const body = this.editForm.controls["bodyControl"].value;

    const messageSubscription = this.messagesApiService
      .createBroadcastMessage(subject, body)
      .subscribe(
        (_) => {
          this.snackBar.success(this.headerMessage, this.MESSAGE_SENT);
          this.status = EntityFormStatus.SUCCESS;
          this.resetValues();
        },
        (error) => {
          this.snackBar.error(this.headerMessage, this.MESSAGE_ERROR, error);
          this.status = EntityFormStatus.ERROR;
        },
        () => {
          messageSubscription.unsubscribe();
        }
      );
  }
}
