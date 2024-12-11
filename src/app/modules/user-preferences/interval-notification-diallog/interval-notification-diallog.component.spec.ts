import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalNotificationDiallogComponent } from './interval-notification-diallog.component';
import { MockColidMatSnackBarService } from 'src/app/shared/mocks/unit-test-mocks';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColidMatSnackBarService } from '../../colid-mat-snack-bar/colid-mat-snack-bar.service';
import { NgxsModule } from '@ngxs/store';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionPanelTitle } from '@angular/material/expansion';

describe('IntervalNotificationDiallogComponent', () => {
  let component: IntervalNotificationDiallogComponent;
  let fixture: ComponentFixture<IntervalNotificationDiallogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntervalNotificationDiallogComponent],
      imports: [
        NgxsModule.forRoot(),
        MatDialogModule,
        MatExpansionPanelTitle,
        NoopAnimationsModule,
        MatDialogModule,
        MatOptionModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: ColidMatSnackBarService,
          useClass: MockColidMatSnackBarService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IntervalNotificationDiallogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
