import { ComponentFixture, TestBed } from "@angular/core/testing";

import { KeywordManagementConfirmationDialogComponent } from "./keyword-management-confirmation-dialog.component";

describe("KeywordManagementConfirmationDialogComponent", () => {
  let component: KeywordManagementConfirmationDialogComponent;
  let fixture: ComponentFixture<KeywordManagementConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeywordManagementConfirmationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      KeywordManagementConfirmationDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
