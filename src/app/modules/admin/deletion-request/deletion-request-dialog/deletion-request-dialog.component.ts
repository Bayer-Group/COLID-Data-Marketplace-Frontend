import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-deletion-request-dialog",
  templateUrl: "./deletion-request-dialog.component.html",
  styleUrls: ["./deletion-request-dialog.component.scss"],
})
export class DeletionRequestDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
