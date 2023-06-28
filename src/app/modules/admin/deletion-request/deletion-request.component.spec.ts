import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DeletionRequestComponent } from "./deletion-request.component";

describe("DeletionRequestComponent", () => {
  let component: DeletionRequestComponent;
  let fixture: ComponentFixture<DeletionRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeletionRequestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
