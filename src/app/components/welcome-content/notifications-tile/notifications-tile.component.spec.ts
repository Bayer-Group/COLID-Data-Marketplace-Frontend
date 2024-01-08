import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotificationsTileComponent } from "./notifications-tile.component";

describe("NotificationsTileComponent", () => {
  let component: NotificationsTileComponent;
  let fixture: ComponentFixture<NotificationsTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsTileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
