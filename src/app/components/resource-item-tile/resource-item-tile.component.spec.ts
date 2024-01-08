import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ResourceItemTileComponent } from "./resource-item-tile.component";

describe("ResourceItemTileComponent", () => {
  let component: ResourceItemTileComponent;
  let fixture: ComponentFixture<ResourceItemTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceItemTileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceItemTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
