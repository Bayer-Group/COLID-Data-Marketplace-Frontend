import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message';
import { EntityFormStatus } from 'src/app/shared/models/entity-form.status';
import { QuillEditorConfig } from 'src/app/shared/constants';

@Component({
  selector: 'welcome-message-form',
  templateUrl: './welcome-message-form.component.html',
  styleUrls: ['./welcome-message-form.component.css']
})
export class WelcomeMessageFormComponent implements OnInit {
  error_msg_empty = 'Message is empty';
  error_msg_not_changed = 'Message has not been changed';
  error_msg_reset = 'Message has been reset';

  editForm: UntypedFormGroup;
  quillEditorConfig = QuillEditorConfig;

  _defaultMessage: WelcomeMessage;

  @Input() headerMessage: string;
  @Input() status: EntityFormStatus = EntityFormStatus.INITIAL;

  @Input() set defaultMessage(value: WelcomeMessage) {
    this._defaultMessage = value;
    this.fillFormControl();
  }
  @Output() submitForm: EventEmitter<string> = new EventEmitter<string>();

  get isLoading(): boolean {
    return this.status === EntityFormStatus.LOADING;
  }

  constructor(private snackBar: ColidMatSnackBarService) {}

  ngOnInit() {
    this.editForm = new UntypedFormGroup({
      editControl: new UntypedFormControl('', Validators.required)
    });
    this.fillFormControl();
  }

  fillFormControl() {
    if (this.editForm == null) return;

    const editControl = this.editForm.controls['editControl'];

    if (this._defaultMessage != null && editControl != null) {
      editControl.setValue(this._defaultMessage.content);
    }
  }

  onSubmit() {
    if (
      !this.editForm.valid ||
      this.isEmptyOrSpaces(this.editForm.controls['editControl'].value)
    ) {
      this.snackBar.warning(this.headerMessage, this.error_msg_empty);
    } else if (
      this.editForm.controls['editControl'].value ==
      this._defaultMessage.content
    ) {
      this.snackBar.warning(this.headerMessage, this.error_msg_not_changed);
    } else {
      let updatedEditorMessage = this.editForm.controls['editControl'].value;
      this.submitForm.emit(updatedEditorMessage);
    }
  }

  onResetWelcomeMessage() {
    if (
      this.editForm.controls['editControl'].value !==
      this._defaultMessage.content
    ) {
      this.editForm.controls['editControl'].setValue(
        this._defaultMessage.content
      );
      this.snackBar.info(this.headerMessage, this.error_msg_reset);
    }
  }

  private isEmptyOrSpaces(str) {
    return str == null || str.match(/^ *$/) !== null;
  }
}
