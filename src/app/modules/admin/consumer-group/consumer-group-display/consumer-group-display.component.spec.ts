import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ConsumerGroupDisplayComponent } from "./consumer-group-display.component";

describe("ConsumerGroupDisplayComponent", () => {
  let component: ConsumerGroupDisplayComponent;
  let fixture: ComponentFixture<ConsumerGroupDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerGroupDisplayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGroupDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
