import { Component, Input } from '@angular/core';
import { ChartData } from 'src/app/shared/models/chart/chart-data';

@Component({
  selector: 'app-system-analytics-chart',
  templateUrl: './system-analytics-chart.component.html',
  styleUrls: ['./system-analytics-chart.component.scss']
})
export class SystemAnalyticsChartComponent {
  colorScheme = {
    domain: [
      '#0075A6',
      '#108000',
      '#6A4C72',
      '#DE0043',
      '#FFEB3B',
      '#FF9800',
      '#9E9E9E',
      '#607D8B'
    ]
  };

  @Input() chart: ChartData;

  @Input() toggleChartTypes: string[];
}
