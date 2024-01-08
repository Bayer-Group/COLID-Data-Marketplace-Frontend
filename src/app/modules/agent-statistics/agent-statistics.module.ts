import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgentStatisticsRoutingModule } from "./agent-statistics-routing.module";
import { AppMaterialModule } from "src/app/app-material.module";
import { SharedModule } from "src/app/shared/shared.module";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { AgentStatisticsOverviewComponent } from "./agent-statistics-overview/agent-statistics-overview.component";
import { AgentStatisticsCrawlerDetailsComponent } from "./agent-statistics-crawler-details/agent-statistics-crawler-details.component";
import { AgentStatisticsLineChartComponent } from "./agent-statistics-crawler-details/agent-statistics-line-chart/agent-statistics-line-chart.component";

@NgModule({
  declarations: [
    AgentStatisticsOverviewComponent,
    AgentStatisticsCrawlerDetailsComponent,
    AgentStatisticsLineChartComponent,
  ],
  imports: [
    CommonModule,
    AgentStatisticsRoutingModule,
    AppMaterialModule,
    SharedModule,
    NgxChartsModule,
  ],
})
export class AgentStatisticsModule {}
