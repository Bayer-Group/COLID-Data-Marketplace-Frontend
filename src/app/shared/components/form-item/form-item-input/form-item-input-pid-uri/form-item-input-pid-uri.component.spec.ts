import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputPidUriComponent } from "./form-item-input-pid-uri.component";

describe("FormItemInputPidUriComponent", () => {
  let component: FormItemInputPidUriComponent;
  let fixture: ComponentFixture<FormItemInputPidUriComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputPidUriComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputPidUriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
