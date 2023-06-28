import { Component, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "colid-view-description-dialog",
  templateUrl: "./view-description-dialog.component.html",
  styleUrls: ["./view-description-dialog.component.scss"],
})
export class ViewDescriptionDialogComponent {
  comment: string;
  label: string;
  description: string;
  displayDescription: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewDescriptionDialogComponent>
  ) {
    this.comment = data.comment;
    this.label = data.label;
    this.description = data.description;

    if (this.comment) {
      this.displayDescription = data.comment;
    } else if (this.description) {
      this.displayDescription = data.description;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
