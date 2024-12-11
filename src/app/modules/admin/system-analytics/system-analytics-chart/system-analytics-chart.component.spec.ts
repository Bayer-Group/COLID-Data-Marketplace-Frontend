import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAnalyticsChartComponent } from './system-analytics-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('SystemAnalyticsChartComponent', () => {
  let component: SystemAnalyticsChartComponent;
  let fixture: ComponentFixture<SystemAnalyticsChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemAnalyticsChartComponent],
      imports: [
        NgxChartsModule,
        MatButtonToggleModule,
        MatCardModule,
        MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemAnalyticsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
