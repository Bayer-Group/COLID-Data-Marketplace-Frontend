import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFavoriteEntryComponent } from './edit-favorite-entry.component';
import { NgxsModule } from '@ngxs/store';
import {
  MockAuthService,
  MockColidMatSnackBarService
} from 'src/app/shared/mocks/unit-test-mocks';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditFavoriteEntryComponent', () => {
  let component: EditFavoriteEntryComponent;
  let fixture: ComponentFixture<EditFavoriteEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditFavoriteEntryComponent],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        },
        {
          provide: AuthService,
          useClass: MockAuthService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditFavoriteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
