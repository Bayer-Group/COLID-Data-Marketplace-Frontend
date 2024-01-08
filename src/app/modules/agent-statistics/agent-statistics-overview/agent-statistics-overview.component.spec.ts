import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AgentStatisticsOverviewComponent } from "./agent-statistics-overview.component";

describe("AgentStatisticsOverviewComponent", () => {
  let component: AgentStatisticsOverviewComponent;
  let fixture: ComponentFixture<AgentStatisticsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentStatisticsOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatisticsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
