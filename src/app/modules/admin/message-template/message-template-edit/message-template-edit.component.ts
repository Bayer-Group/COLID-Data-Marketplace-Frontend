import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core';
import { take } from 'rxjs/operators';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MessageTemplate } from 'src/app/shared/models/message-template/message-template';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  AbstractControl
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { UpdateMessageTemplate } from 'src/app/states/message-templates.state';

@Component({
  selector: 'app-message-template-edit',
  templateUrl: './message-template-edit.component.html',
  styleUrls: ['./message-template-edit.component.css']
})
export class MessageTemplateEditComponent implements OnInit {
  @Input() messageTemplate: MessageTemplate;

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  placeholders = {
    ColidEntrySubscriptionUpdate: ['%COLID_LABEL%', '%COLID_PID_URI%'],
    ColidEntrySubscriptionDelete: ['%COLID_LABEL%', '%COLID_PID_URI%'],
    InvalidUserWarning: ['%COLID_LABEL%', '%COLID_PID_URI%', '%INVALID_USERS%'],
    StoredQueryResult: ['%SEARCH_NAME%', '%UPDATED_RESOURCES%']
  };

  templateForm: UntypedFormGroup;
  activeControl: AbstractControl; // to append placeholder values

  get f() {
    return this.templateForm.controls;
  }

  constructor(
    private store: Store,
    private snackbar: ColidMatSnackBarService,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this.templateForm = new UntypedFormGroup({
      subjectControl: new UntypedFormControl('', Validators.required),
      bodyControl: new UntypedFormControl('', Validators.required)
    });
    this.fillFormControl();
  }

  fillFormControl() {
    if (this.templateForm == null) {
      return;
    }

    const subControl = this.templateForm.controls['subjectControl'];
    if (subControl != null) {
      subControl.setValue(this.messageTemplate.subject);
    }

    const bodControl = this.templateForm.controls['bodyControl'];
    if (bodControl != null) {
      bodControl.setValue(this.messageTemplate.body);
    }
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  onFocus(controlName: string) {
    this.activeControl = this.templateForm.controls[controlName];
  }

  onPlaceholder(placeholder: string) {
    if (this.activeControl != null) {
      this.activeControl.patchValue(
        `${this.activeControl.value} ${placeholder} `
      );
    }
  }

  get valuesChanged() {
    const sameSubject =
      this.templateForm.controls['subjectControl'].value.trim() !==
      this.messageTemplate.subject;
    const sameBody =
      this.templateForm.controls['bodyControl'].value.trim() !==
      this.messageTemplate.body;

    return sameSubject || sameBody;
  }

  get valuesValid() {
    const emptySubject = !this.templateForm.controls['subjectControl'].value;
    const emptyBody = !this.templateForm.controls['bodyControl'].value;
    return emptySubject || emptyBody;
  }

  onReset() {
    if (this.valuesChanged) {
      this.fillFormControl();
      this.snackbar.info(
        "Template '" + this.messageTemplate.type + "' restored",
        null
      );
    }
  }

  onSubmit() {
    if (!this.valuesChanged) {
      this.snackbar.warning(
        'Template unchanged',
        "The template hasn't been changed."
      );
    } else {
      if (this.valuesValid) {
        this.snackbar.warning(
          'Template empty',
          'The template contains empty fields.'
        );
        return;
      }
      this.messageTemplate.subject =
        this.templateForm.controls['subjectControl'].value.trim();
      this.messageTemplate.body =
        this.templateForm.controls['bodyControl'].value.trim();

      this.updateMessageTemplate();
    }
  }

  updateMessageTemplate() {
    this.store
      .dispatch(new UpdateMessageTemplate(this.messageTemplate))
      .subscribe((_) =>
        this.snackbar.success(
          "Template '" + this.messageTemplate.type + "' saved",
          null
        )
      );
  }
}
