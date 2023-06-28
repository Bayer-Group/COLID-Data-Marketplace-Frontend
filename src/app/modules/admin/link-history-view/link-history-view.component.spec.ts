import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LinkHistoryViewComponent } from "./link-history-view.component";

describe("LinkHistoryViewComponent", () => {
  let component: LinkHistoryViewComponent;
  let fixture: ComponentFixture<LinkHistoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkHistoryViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
