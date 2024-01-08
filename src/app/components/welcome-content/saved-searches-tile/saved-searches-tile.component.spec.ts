import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SavedSearchesTileComponent } from "./saved-searches-tile.component";

describe("SavedSearchesTileComponent", () => {
  let component: SavedSearchesTileComponent;
  let fixture: ComponentFixture<SavedSearchesTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedSearchesTileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SavedSearchesTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
