import { Component, Inject, OnInit } from "@angular/core";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import { DeleteFavorite } from "../../favorites.state";

@Component({
  selector: "colid-delete-favorite-list",
  templateUrl: "./delete-favorite-list.component.html",
  styleUrls: ["../favorite-list.component.scss", "./delete-favorite-list.component.scss"],
})
export class DeleteFavoriteListComponent implements OnInit {

  userId: string;
  favoritesListId: string;
  favoritesListName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private store: Store,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DeleteFavoriteListComponent>,
  ) {
    this.userId = data.userId
    this.favoritesListId = data.id;
    this.favoritesListName = data.name;
  }

  ngOnInit(): void {}


  deleteFavoriteList(favoritesListId: string) {
    this.store.dispatch(new DeleteFavorite(this.userId, favoritesListId));
    this.dialogRef.close(true)
  }
}