import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemErrorsComponent } from "./form-item-errors.component";

describe("FormItemErrorsComponent", () => {
  let component: FormItemErrorsComponent;
  let fixture: ComponentFixture<FormItemErrorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemErrorsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
