import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDialogComponent } from './export-dialog.component';
import { MockMatDialogRef } from 'src/app/shared/mocks/unit-test-mocks';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('ExportDialogComponent', () => {
  let component: ExportDialogComponent;
  let fixture: ComponentFixture<ExportDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportDialogComponent],
      imports: [
        MatDialogModule,
        MatRadioModule,
        FormsModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: MockMatDialogRef
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
