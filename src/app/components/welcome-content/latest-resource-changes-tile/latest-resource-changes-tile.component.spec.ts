import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LatestResourceChangesTileComponent } from "./latest-resource-changes-tile.component";

describe("LatestResourceChangesTileComponent", () => {
  let component: LatestResourceChangesTileComponent;
  let fixture: ComponentFixture<LatestResourceChangesTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LatestResourceChangesTileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestResourceChangesTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
