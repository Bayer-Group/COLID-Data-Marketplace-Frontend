import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AgentStatisticsLineChartComponent } from "./agent-statistics-line-chart.component";

describe("AgentStatisticsLineChartComponent", () => {
  let component: AgentStatisticsLineChartComponent;
  let fixture: ComponentFixture<AgentStatisticsLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentStatisticsLineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatisticsLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
