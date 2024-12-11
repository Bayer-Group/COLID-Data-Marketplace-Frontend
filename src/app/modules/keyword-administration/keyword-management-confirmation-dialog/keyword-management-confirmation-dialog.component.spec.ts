import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordManagementConfirmationDialogComponent } from './keyword-management-confirmation-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { KeywordManagementApiService } from 'src/app/core/http/keyword-management.api.service';
import { MockKeywordManagementApiService } from 'src/app/shared/mocks/unit-test-mocks';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('KeywordManagementConfirmationDialogComponent', () => {
  let component: KeywordManagementConfirmationDialogComponent;
  let fixture: ComponentFixture<KeywordManagementConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeywordManagementConfirmationDialogComponent],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            graphPidUri: 'test',
            graphType: ['test'],
            itemsAdded: [],
            itemsEdited: [],
            itemsDeleted: []
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        },
        {
          provide: KeywordManagementApiService,
          useClass: MockKeywordManagementApiService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(
      KeywordManagementConfirmationDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
