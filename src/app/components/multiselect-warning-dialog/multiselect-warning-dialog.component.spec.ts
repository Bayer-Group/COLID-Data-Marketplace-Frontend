import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiselectWarningDialogComponent } from "./multiselect-warning-dialog.component";

describe("MultiselectDialogComponent", () => {
  let component: MultiselectWarningDialogComponent;
  let fixture: ComponentFixture<MultiselectWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiselectWarningDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
