import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { FormItemInputTaxonomyComponent } from "./form-item-input-taxonomy.component";

describe("FormItemInputTaxonomyComponent", () => {
  let component: FormItemInputTaxonomyComponent;
  let fixture: ComponentFixture<FormItemInputTaxonomyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemInputTaxonomyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormItemInputTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
