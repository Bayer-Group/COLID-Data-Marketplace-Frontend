import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AuthService } from "src/app/modules/authentication/services/auth.service";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";

@Component({
  selector: "colid-view-description-dialog",
  templateUrl: "./view-description-dialog.component.html",
  styleUrls: ["./view-description-dialog.component.scss"],
})
export class ViewDescriptionDialogComponent implements OnInit {

   comment: string;
   label: string;
   description: string;
   displayDescription: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private store: Store,
    private dialogRef: MatDialogRef<ViewDescriptionDialogComponent>,
    private AuthService: AuthService,
    private snackBar: ColidMatSnackBarService
  ) {
    this.comment = data.comment;
    this.label = data.label;
    this.description = data.description;

    if(this.comment)
    {
      this.displayDescription = data.comment;
    }
    else if(this.description)
    {
      this.displayDescription = data.description;
    }
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

