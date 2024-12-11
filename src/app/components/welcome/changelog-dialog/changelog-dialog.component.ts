import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message';
import { SetUserInformationFlag } from 'src/app/states/user-info.state';

interface DialogData {
  welcomeMessage: WelcomeMessage;
}

@Component({
  selector: 'app-changelog-dialog',
  templateUrl: './changelog-dialog.component.html',
  styleUrls: ['./changelog-dialog.component.scss']
})
export class ChangelogDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private store: Store,
    private dialogRef: MatDialogRef<ChangelogDialogComponent>
  ) {}

  setUserInformationFlag() {
    this.store.dispatch(new SetUserInformationFlag(false));
    this.dialogRef.close();
  }
}
