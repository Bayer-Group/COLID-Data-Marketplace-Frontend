import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ConsumerGroupNewComponent } from "./consumer-group-new.component";

describe("ConsumerGroupNewComponent", () => {
  let component: ConsumerGroupNewComponent;
  let fixture: ComponentFixture<ConsumerGroupNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerGroupNewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGroupNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
