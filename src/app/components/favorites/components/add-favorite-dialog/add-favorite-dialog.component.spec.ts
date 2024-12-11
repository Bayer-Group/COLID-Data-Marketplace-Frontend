import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFavoriteDialogComponent } from './add-favorite-dialog.component';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { FavoritesService } from '../../services/favorites.service';
import {
  MockAuthService,
  MockColidMatSnackBarService,
  MockFavoritesService
} from 'src/app/shared/mocks/unit-test-mocks';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { NgxsModule } from '@ngxs/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

describe('AddFavoriteDialogComponent', () => {
  let component: AddFavoriteDialogComponent;
  let fixture: ComponentFixture<AddFavoriteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFavoriteDialogComponent],
      imports: [
        NgxsModule.forRoot(),
        MatDialogModule,
        MatCheckboxModule,
        MatButtonModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: FavoritesService,
          useClass: MockFavoritesService
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFavoriteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
