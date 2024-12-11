import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateFavoriteListComponent } from './create-favorite-list.component';
import { NgxsModule } from '@ngxs/store';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import {
  MockAuthService,
  MockColidMatSnackBarService,
  MockFavoritesService
} from 'src/app/shared/mocks/unit-test-mocks';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { FavoritesService } from '../../services/favorites.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateFavoriteListComponent', () => {
  let component: CreateFavoriteListComponent;
  let fixture: ComponentFixture<CreateFavoriteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFavoriteListComponent],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: FavoritesService, useClass: MockFavoritesService },
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
