import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputNumberComponent } from "./form-item-input-number.component";

describe("FormItemInputNumberComponent", () => {
  let component: FormItemInputNumberComponent;
  let fixture: ComponentFixture<FormItemInputNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputNumberComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
