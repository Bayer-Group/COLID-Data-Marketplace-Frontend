import { Component } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Observable } from 'rxjs';
import { AgentStatisticsApiService } from 'src/app/core/http/agent-statistics.api.service';
import { OverallStatisticsDto } from 'src/app/shared/models/agent-statistics/OverallStatisticsDto';

@Component({
  selector: 'app-agent-statistics-overview',
  templateUrl: './agent-statistics-overview.component.html',
  styleUrls: ['./agent-statistics-overview.component.css']
})
export class AgentStatisticsOverviewComponent {
  displayedColumns: string[] = [
    'crawlerName',
    'lastRunDate',
    'status',
    'schedule',
    'actions'
  ];
  overallStatisticsList$: Observable<OverallStatisticsDto[]>;

  constructor(
    private router: Router,
    private agentStatisticsCrawlerService: AgentStatisticsApiService
  ) {
    this.overallStatisticsList$ =
      this.agentStatisticsCrawlerService.getOverallStatistics();
  }

  navigateToCrawlerDetails(crawlerName: string) {
    const crawlerStatisticsEndDate = moment().startOf('day');
    const crawlerStatisticsStartDate = moment()
      .utcOffset(0)
      .startOf('day')
      .subtract(7, 'd');
    const crawlerStatisticsStartDateString =
      crawlerStatisticsStartDate.format('YYYY-MM-DD');
    const crawlerStatisticsEndDateString =
      crawlerStatisticsEndDate.format('YYYY-MM-DD');
    let queryParams = {
      crawlerName,
      startDate: crawlerStatisticsStartDateString,
      endDate: crawlerStatisticsEndDateString
    };
    this.router.navigate(['/admin', 'agent-statistics', 'crawler-details'], {
      queryParams
    });
  }
}
