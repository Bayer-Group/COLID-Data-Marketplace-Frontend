import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LinkHistoryDialogComponent } from "./link-history.component";

describe("LinkHistoryDialogComponent", () => {
  let component: LinkHistoryDialogComponent;
  let fixture: ComponentFixture<LinkHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkHistoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
