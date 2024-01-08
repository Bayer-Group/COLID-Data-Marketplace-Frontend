import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserStatisticsViewComponent } from "./user-statistics-view.component";

describe("UserStatisticsViewComponent", () => {
  let component: UserStatisticsViewComponent;
  let fixture: ComponentFixture<UserStatisticsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStatisticsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserStatisticsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
