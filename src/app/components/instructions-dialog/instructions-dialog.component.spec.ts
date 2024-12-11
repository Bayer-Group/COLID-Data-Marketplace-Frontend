import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsDialogComponent } from './instructions-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('InstructionsDialogComponent', () => {
  let component: InstructionsDialogComponent;
  let fixture: ComponentFixture<InstructionsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructionsDialogComponent],
      imports: [MatDialogModule, MatIconModule, MatButtonModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Test Title',
            imageUrl: 'test-url'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
