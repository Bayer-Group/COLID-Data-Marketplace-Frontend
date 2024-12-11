import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatisticsLineChartComponent } from './agent-statistics-line-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AgentStatisticsLineChartComponent', () => {
  let component: AgentStatisticsLineChartComponent;
  let fixture: ComponentFixture<AgentStatisticsLineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentStatisticsLineChartComponent],
      imports: [NgxChartsModule, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatisticsLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
