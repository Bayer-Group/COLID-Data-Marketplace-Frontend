import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DistributionEndpointComponent } from "./distribution-endpoint.component";

describe("DistributionEndpointComponent", () => {
  let component: DistributionEndpointComponent;
  let fixture: ComponentFixture<DistributionEndpointComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DistributionEndpointComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
