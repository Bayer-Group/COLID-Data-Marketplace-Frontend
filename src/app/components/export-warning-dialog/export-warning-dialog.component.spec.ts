import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportWarningDialogComponent } from './export-warning-dialog.component';

describe('ExportWarningDialogComponent', () => {
  let component: ExportWarningDialogComponent;
  let fixture: ComponentFixture<ExportWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportWarningDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
