import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemCreateNestedComponent } from "./form-item-create-nested.component";

describe("FormItemCreateNestedComponent", () => {
  let component: FormItemCreateNestedComponent;
  let fixture: ComponentFixture<FormItemCreateNestedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemCreateNestedComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemCreateNestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
