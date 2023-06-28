import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { WelcomeContentComponent } from "./welcome-content.component";

describe("WelcomeContentComponent", () => {
  let component: WelcomeContentComponent;
  let fixture: ComponentFixture<WelcomeContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeContentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
