import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// TODO: Refactor - use one generic dialog for confirmation, deletion request, delete item, simple information dialogs

interface DialogData {
  header: string;
  body: string;
}

@Component({
  selector: 'app-simple-information-dialog',
  templateUrl: './simple-information-dialog.component.html',
  styleUrls: ['./simple-information-dialog.component.scss']
})
export class SimpleInformationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
