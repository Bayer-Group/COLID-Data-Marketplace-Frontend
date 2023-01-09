import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: "colid-remove-favorite-entry",
  templateUrl: "./remove-favorite-entry.component.html",
  styleUrls: ["../favorite-list.component.scss", "./remove-favorite-entry.component.scss"],
})
export class RemoveFavoriteEntryComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RemoveFavoriteEntryComponent>) {}

  ngOnInit(): void {}

  confirm() {
    this.dialogRef.close(true);
  }

  // removeFavoriteEntry(favoriteListEntryId: string) {
  //   this.store.dispatch(new RemoveEntry(this.userId, this.pidUri, this.favoriteListId, favoriteListEntryId));
  //   this.dialogRef.close;
  // }
}
