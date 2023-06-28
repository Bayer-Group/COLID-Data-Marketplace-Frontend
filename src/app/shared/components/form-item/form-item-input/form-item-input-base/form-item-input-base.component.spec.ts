import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputBaseComponent } from "./form-item-input-base.component";

describe("FormItemInputBaseComponent", () => {
  let component: FormItemInputBaseComponent;
  let fixture: ComponentFixture<FormItemInputBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
