import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFavoriteListComponent } from './edit-favorite-list.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { MockMatDialogRef } from 'src/app/shared/mocks/unit-test-mocks';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditFavoriteListComponent', () => {
  let component: EditFavoriteListComponent;
  let fixture: ComponentFixture<EditFavoriteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditFavoriteListComponent],
      imports: [
        NoopAnimationsModule,
        NgxsModule.forRoot(),
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],

      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialogRef,
          useValue: MockMatDialogRef
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditFavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
