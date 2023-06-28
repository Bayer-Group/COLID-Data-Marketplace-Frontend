import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ExtendedUriTemplateEditComponent } from "./extended-uri-template-edit.component";

describe("ExtendedUriTemplateEditComponent", () => {
  let component: ExtendedUriTemplateEditComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedUriTemplateEditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedUriTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
