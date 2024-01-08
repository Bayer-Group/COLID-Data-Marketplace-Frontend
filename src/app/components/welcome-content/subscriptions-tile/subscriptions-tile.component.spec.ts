import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubscriptionsTileComponent } from "./subscriptions-tile.component";

describe("SubscriptionsTileComponent", () => {
  let component: SubscriptionsTileComponent;
  let fixture: ComponentFixture<SubscriptionsTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionsTileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
