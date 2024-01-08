import { Component, Input } from "@angular/core";

@Component({
  selector: "app-agent-statistics-line-chart",
  templateUrl: "./agent-statistics-line-chart.component.html",
  styleUrls: ["./agent-statistics-line-chart.component.css"],
})
export class AgentStatisticsLineChartComponent {
  @Input() chartWidth: number;
  @Input() chartHeight: number;
  @Input() data: any[];
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() xAxisTicks;

  constructor() {}
}
