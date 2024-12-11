import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogDialogComponent } from './changelog-dialog.component';
import { MockMatDialogRef } from 'src/app/shared/mocks/unit-test-mocks';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('ChangelogDialogComponent', () => {
  let component: ChangelogDialogComponent;
  let fixture: ComponentFixture<ChangelogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangelogDialogComponent],
      imports: [
        MatDialogModule,
        NgxsModule.forRoot([]),
        FormsModule,
        QuillModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            welcomeMessage: {
              title: 'test title',
              message: 'test message',
              version: '0.0.0'
            }
          }
        },
        {
          provide: MatDialogRef,
          useClass: MockMatDialogRef
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
