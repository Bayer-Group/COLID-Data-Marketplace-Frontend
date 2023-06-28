import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PidUriTemplateComponent } from "./pid-uri-template.component";

describe("PidUriTemplateComponent", () => {
  let component: PidUriTemplateComponent;
  let fixture: ComponentFixture<PidUriTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PidUriTemplateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidUriTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
