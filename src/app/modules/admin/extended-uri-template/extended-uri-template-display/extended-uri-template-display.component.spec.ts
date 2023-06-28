import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ExtendedUriTemplateDisplayComponent } from "./extended-uri-template-display.component";

describe("ExtendedUriTemplateDisplayComponent", () => {
  let component: ExtendedUriTemplateDisplayComponent;
  let fixture: ComponentFixture<ExtendedUriTemplateDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedUriTemplateDisplayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedUriTemplateDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
