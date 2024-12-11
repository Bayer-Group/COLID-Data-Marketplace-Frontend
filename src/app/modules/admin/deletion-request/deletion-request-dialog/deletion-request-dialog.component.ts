import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// TODO: Refactor - use one generic dialog for confirmation, deletion request, delete item, simple information dialogs

@Component({
  selector: 'app-deletion-request-dialog',
  templateUrl: './deletion-request-dialog.component.html',
  styleUrls: ['./deletion-request-dialog.component.scss']
})
export class DeletionRequestDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
