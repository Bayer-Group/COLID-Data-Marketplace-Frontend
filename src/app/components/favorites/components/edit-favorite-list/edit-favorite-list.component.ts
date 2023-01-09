import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import { SaveFavoriteList } from "../../favorites.state";

@Component({
  selector: "colid-edit-favorite-list",
  templateUrl: "./edit-favorite-list.component.html",
  styleUrls: ["../favorite-list.component.scss", "./edit-favorite-list.component.scss"],
})
export class EditFavoriteListComponent implements OnInit {
  userId: string;
  favoritesListId: string;
  favoritesListName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private store: Store,
    private dialogRef: MatDialogRef<EditFavoriteListComponent>,
  ) {
    this.userId = data.userId
    this.favoritesListId = data.id;
    this.favoritesListName = data.name;
  }

  ngOnInit(): void {}

  editFavorite() {
    this.store.dispatch(new SaveFavoriteList(this.userId, this.favoritesListId, this.favoritesListName));
    this.dialogRef.close(true);
  }
}

