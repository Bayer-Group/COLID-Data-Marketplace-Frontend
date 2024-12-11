import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectWarningDialogComponent } from './multiselect-warning-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('MultiselectDialogComponent', () => {
  let component: MultiselectWarningDialogComponent;
  let fixture: ComponentFixture<MultiselectWarningDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiselectWarningDialogComponent],
      imports: [MatDialogModule, MatButtonModule, MatIconModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { dialogTitle: 'Title', dialogContent: 'Content' }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiselectWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
