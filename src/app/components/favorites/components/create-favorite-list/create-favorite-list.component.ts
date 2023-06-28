import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { Favorites } from "src/app/shared/models/favorites";
import { FavoritesState, FetchFavorites } from "../../favorites.state";
import { FavoritesService } from "../../services/favorites.service";
import { AuthService } from "src/app/modules/authentication/services/auth.service";

@Component({
  selector: "colid-create-favorite-list",
  templateUrl: "./create-favorite-list.component.html",
  styleUrls: [
    "../favorite-list.component.scss",
    "./create-favorite-list.component.scss",
  ],
})
export class CreateFavoriteListComponent implements OnInit {
  @Select(FavoritesState.getFavorites) favorites$: Observable<Favorites[]>;

  favoritesForm!: FormGroup;
  name: string;
  userId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private favoritesService: FavoritesService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateFavoriteListComponent>,
    private authService: AuthService,
    private snackBar: ColidMatSnackBarService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.authService.currentUserId$.subscribe((uid) => (this.userId = uid));
    this.favoritesForm = this.formBuilder.group({
      name: ["", Validators.required],
    });
  }
  createFavorite() {
    if (this.favoritesForm.valid) {
      var name = this.favoritesForm.get("name").value;
      var payload = { name: name };

      if (name == "") {
        this.snackBar.error("Error", "Name field cannot be empty");
      } else {
        this.favoritesService
          .createFavoritesList(this.userId, payload)
          .subscribe({
            next: (_) => {
              this.store.dispatch(new FetchFavorites(this.userId));
              this.snackBar.success(
                "Favorite List created",
                "This List was successfully created."
              );
              this.favoritesForm.reset();
              this.dialogRef.close;
            },
            error: () => {
              this.snackBar.warning(
                "Fail to create",
                "This name already exists."
              );
            },
          });
      }
    }
  }
}
