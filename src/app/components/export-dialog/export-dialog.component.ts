import { Component, OnInit } from '@angular/core';
import { ExportDto } from 'src/app/shared/models/export-dto';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { InitiateExport } from 'src/app/states/search.state';
import { MatRadioChange } from '@angular/material/radio';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {

  public exportOptions: ExportDto = new ExportDto();
  private optionsBackup: ExportDto = new ExportDto();

  constructor(
    private route: ActivatedRoute, 
    private store: Store, 
    private snackBar: ColidMatSnackBarService,
    public dialogRef: MatDialogRef<ExportDialogComponent>) {
    this.exportOptions.exportContent = "uriAndMeta";
    this.exportOptions.exportFormat = "excelTemplate";
    this.exportOptions.readableValues = "clearText";
    this.exportOptions.includeHeader = true;
    this.optionsBackup = this.exportOptions;
  }

  ngOnInit(): void {
  }

  startExport(): void {
    this.store.dispatch(new InitiateExport(this.exportOptions, this.route));
    this.snackBar.successCustomDuration(
      "Export started", 
      "Your export has been started. It could take some minutes, until the download link will appear in your notifications",
      null,
      5000
    );
    this.dialogRef.close();
  }

  exportOptionChanged(event: MatRadioChange){
    
  }
}
