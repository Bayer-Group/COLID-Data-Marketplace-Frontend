import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputMultiselectComponent } from "./form-item-input-multiselect.component";

describe("FormItemInputMultiselectComponent", () => {
  let component: FormItemInputMultiselectComponent;
  let fixture: ComponentFixture<FormItemInputMultiselectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputMultiselectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
