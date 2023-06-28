import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-multiselect-warning-dialog",
  templateUrl: "./multiselect-warning-dialog.component.html",
  styleUrls: ["./multiselect-warning-dialog.component.scss"],
})
export class MultiselectWarningDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { dialogTitle: string; dialogContent: string }
  ) {}
}
