import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ExtendedUriTemplateFormComponent } from "./extended-uri-template-form.component";

describe("ExtendedUriTemplateFormComponent", () => {
  let component: ExtendedUriTemplateFormComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedUriTemplateFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedUriTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
