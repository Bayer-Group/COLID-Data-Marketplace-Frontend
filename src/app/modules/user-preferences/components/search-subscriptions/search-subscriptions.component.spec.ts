import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SearchSubscriptionsComponent } from "./search-subscriptions.component";

describe("SearchSubscriptionsComponent", () => {
  let component: SearchSubscriptionsComponent;
  let fixture: ComponentFixture<SearchSubscriptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchSubscriptionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
