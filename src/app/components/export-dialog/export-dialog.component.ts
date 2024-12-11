import { Component } from '@angular/core';
import {
  defaultExportSettings,
  ExportDto
} from 'src/app/shared/models/export-dto';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent {
  public exportOptions: ExportDto = { ...defaultExportSettings };

  constructor(public dialogRef: MatDialogRef<ExportDialogComponent>) {}

  startExport(): void {
    // this.snackBar.successCustomDuration(
    //   "Export started",
    //   "Your export has been started. It could take some minutes, until the download link will appear in your notifications",
    //   null,
    //   5000
    // );
    this.dialogRef.close(this.exportOptions);
  }
}
