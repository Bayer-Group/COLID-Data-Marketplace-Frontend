import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { OverallStatisticsRawDto } from "src/app/shared/models/agent-statistics/OverallStatisticsRawDto";
import { Observable, of } from "rxjs";
import { catchError, delay, map } from "rxjs/operators";
import { OverallStatisticsDto } from "src/app/shared/models/agent-statistics/OverallStatisticsDto";
import { environment } from "src/environments/environment";
import cronstrue from "cronstrue";

@Injectable({
  providedIn: "root",
})
export class AgentStatisticsApiService {
  constructor(private httpClient: HttpClient) {}

  getOverallStatistics(): Observable<OverallStatisticsDto[]> {
    if (environment.allowAnonymous) {
      const result: OverallStatisticsRawDto = {
        adx: {
          state: "DISABLED",
          schedule: "cron(30 0 * * ? *)",
          lastInvocationDate: "2023-06-26 12:36",
        },
        beat: {
          state: "DISABLED",
          schedule: "cron(15 0 * * ? *)",
          lastInvocationDate: "2023-06-22 14:02",
        },
        ctgov: {
          state: "DISABLED",
          schedule: "cron(45 0 * * ? *)",
          lastInvocationDate: "2021-08-06 11:30",
        },
        maps: {
          state: "DISABLED",
          schedule: "cron(30 0 * * ? *)",
          lastInvocationDate: "2022-03-04 11:03",
        },
        kumostudy: {
          lastInvocationDate: "2022-12-14 12:43",
        },
        collibra: {
          lastInvocationDate: "2023-06-29 01:00",
        },
        impact: {
          state: "DISABLED",
          schedule: "cron(30 0 * * ? *)",
          lastInvocationDate: "2023-06-28 14:51",
        },
      };
      return of(result).pipe(
        map((res: OverallStatisticsRawDto) => {
          return Object.entries(res).reduce(
            (overallStatisticsList, [key, value]) => {
              let singleCrawlerStatistic: OverallStatisticsDto = {
                crawlerName: key,
                status: value.state ?? " - ",
                schedule: value.schedule
                  ? cronstrue.toString(
                      value.schedule.replace(/[cron\(\)]+/g, "")
                    )
                  : " - ",
                lastRunDate: value.lastInvocationDate,
              };
              overallStatisticsList.push(singleCrawlerStatistic);
              return overallStatisticsList;
            },
            []
          );
        }),
        delay(500)
      );
    } else {
      const url = `${environment.agentStatisticsApi}/overall-statistics`;
      return this.httpClient.get<OverallStatisticsRawDto>(url).pipe(
        map((res: OverallStatisticsRawDto) => {
          return Object.entries(res).reduce(
            (overallStatisticsList, [key, value]) => {
              let singleCrawlerStatistic: OverallStatisticsDto = {
                crawlerName: key,
                status: value.state ?? " - ",
                schedule: value.schedule
                  ? cronstrue.toString(
                      value.schedule.replace(/[cron\(\)]+/g, "")
                    )
                  : " - ",
                lastRunDate: value.lastInvocationDate,
              };
              overallStatisticsList.push(singleCrawlerStatistic);
              return overallStatisticsList;
            },
            []
          );
        }),
        catchError((_) => of([]))
      );
    }
  }

  getDetailedStatistics(queryParams: {
    crawlerName: string;
    startDate: string;
    endDate: string;
  }) {
    const url = `${environment.agentStatisticsApi}/detailed-statistics`;
    let params = new HttpParams({
      fromObject: queryParams,
    });
    const headers = new HttpHeaders({
      Authorization:
        "Bearer Loremipsumdolorsitamet",
    });
    return this.httpClient.get(url, { params, headers });
  }
}
