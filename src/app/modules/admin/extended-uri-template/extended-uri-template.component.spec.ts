import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ExtendedUriTemplateComponent } from "./extended-uri-template.component";

describe("ExtendedUriTemplateComponent", () => {
  let component: ExtendedUriTemplateComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedUriTemplateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedUriTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
