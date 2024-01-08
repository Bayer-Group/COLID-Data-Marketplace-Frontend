import { ComponentFixture, TestBed } from "@angular/core/testing";

import { KeywordManagementComponent } from "./keyword-management.component";

describe("KeywordManagementComponent", () => {
  let component: KeywordManagementComponent;
  let fixture: ComponentFixture<KeywordManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeywordManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeywordManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
