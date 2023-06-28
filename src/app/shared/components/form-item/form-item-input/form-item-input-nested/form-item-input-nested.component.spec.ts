import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputNestedComponent } from "./form-item-input-nested.component";

describe("FormItemInputNestedComponent", () => {
  let component: FormItemInputNestedComponent;
  let fixture: ComponentFixture<FormItemInputNestedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputNestedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputNestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
