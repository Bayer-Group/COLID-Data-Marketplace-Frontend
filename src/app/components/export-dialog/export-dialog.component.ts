import { Component, OnInit } from '@angular/core';
import { defaultExportSettings, ExportDto } from 'src/app/shared/models/export-dto';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {

  public exportOptions: ExportDto = {...defaultExportSettings};

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>) {
  }

  ngOnInit(): void {
  }

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
