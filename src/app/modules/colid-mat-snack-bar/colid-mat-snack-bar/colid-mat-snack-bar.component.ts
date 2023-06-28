import { Component, Inject, NgZone } from "@angular/core";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";
import { ColidMatSnackBarData } from "../colid-mat-snack-bar-data.model";
import { ColidMatSnackBarType } from "../colid-mat-snack-bar-type.model";

@Component({
  selector: "app-colid-mat-snack-bar",
  templateUrl: "./colid-mat-snack-bar.component.html",
  styleUrls: ["./colid-mat-snack-bar.component.css"],
})
export class ColidMatSnackBarComponent {
  colidSnackBarType = ColidMatSnackBarType;

  constructor(
    public snackbarref: MatSnackBarRef<ColidMatSnackBarComponent>,
    private zone: NgZone,
    @Inject(MAT_SNACK_BAR_DATA) public data: ColidMatSnackBarData
  ) {}

  dismiss() {
    this.zone.run(() => {
      this.snackbarref.dismiss();
    });
  }
}
