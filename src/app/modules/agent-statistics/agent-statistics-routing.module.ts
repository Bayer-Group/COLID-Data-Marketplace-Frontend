import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AgentStatisticsOverviewComponent } from './agent-statistics-overview/agent-statistics-overview.component';
import { AgentStatisticsCrawlerDetailsComponent } from './agent-statistics-crawler-details/agent-statistics-crawler-details.component';

const agentStatusRoute = [
  {
    path: '',
    component: AgentStatisticsOverviewComponent
  },
  {
    path: 'crawler-details',
    component: AgentStatisticsCrawlerDetailsComponent
  }
];

const routes: Routes = agentStatusRoute;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentStatisticsRoutingModule {}
