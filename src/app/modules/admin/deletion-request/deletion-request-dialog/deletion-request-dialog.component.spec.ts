import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionRequestDialogComponent } from './deletion-request-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// TODO: Refactor - use one generic dialog for confirmation, deletion request, delete item, simple information dialogs
xdescribe('DeletionRequestDialogComponent', () => {
  let component: DeletionRequestDialogComponent;
  let fixture: ComponentFixture<DeletionRequestDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletionRequestDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletionRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
