import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleInformationDialogComponent } from './simple-information-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('SimpleInformationDialogComponent', () => {
  let component: SimpleInformationDialogComponent;
  let fixture: ComponentFixture<SimpleInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleInformationDialogComponent],
      imports: [MatDialogModule, MatButtonModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            header: 'test header',
            body: 'test body'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
