import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputDistributionComponent } from "./form-item-input-distribution.component";

describe("FormItemInputDistributionComponent", () => {
  let component: FormItemInputDistributionComponent;
  let fixture: ComponentFixture<FormItemInputDistributionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputDistributionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
