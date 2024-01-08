import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InstructionsDialogComponent } from "./instructions-dialog.component";

describe("InstructionsDialogComponent", () => {
  let component: InstructionsDialogComponent;
  let fixture: ComponentFixture<InstructionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructionsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
