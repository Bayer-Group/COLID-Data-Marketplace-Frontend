import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputGeneralComponent } from "./form-item-input-general.component";

describe("FormItemInputGeneralComponent", () => {
  let component: FormItemInputGeneralComponent;
  let fixture: ComponentFixture<FormItemInputGeneralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputGeneralComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
