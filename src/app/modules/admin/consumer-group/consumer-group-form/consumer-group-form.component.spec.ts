import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ConsumerGroupFormComponent } from "./consumer-group-form.component";

describe("ConsumerGroupFormComponent", () => {
  let component: ConsumerGroupFormComponent;
  let fixture: ComponentFixture<ConsumerGroupFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumerGroupFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
