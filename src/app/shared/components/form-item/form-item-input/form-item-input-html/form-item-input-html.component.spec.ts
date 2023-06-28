import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputHtmlComponent } from "./form-item-input-html.component";

describe("FormItemInputHtmlComponent", () => {
  let component: FormItemInputHtmlComponent;
  let fixture: ComponentFixture<FormItemInputHtmlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputHtmlComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
