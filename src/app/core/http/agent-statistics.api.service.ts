import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OverallStatisticsRawDto } from 'src/app/shared/models/agent-statistics/OverallStatisticsRawDto';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { OverallStatisticsDto } from 'src/app/shared/models/agent-statistics/OverallStatisticsDto';
import { environment } from 'src/environments/environment';
import cronstrue from 'cronstrue';

@Injectable({
  providedIn: 'root'
})
export class AgentStatisticsApiService {
  constructor(private httpClient: HttpClient) {}

  getOverallStatistics(): Observable<OverallStatisticsDto[]> {
    if (environment.allowAnonymous) {
      const result: OverallStatisticsRawDto = {
        adx: {
          state: 'DISABLED',
          schedule: 'cron(30 0 * * ? *)',
          lastInvocationDate: '2023-06-26 12:36'
        },
        beat: {
          state: 'DISABLED',
          schedule: 'cron(15 0 * * ? *)',
          lastInvocationDate: '2023-06-22 14:02'
        },
        ctgov: {
          state: 'DISABLED',
          schedule: 'cron(45 0 * * ? *)',
          lastInvocationDate: '2021-08-06 11:30'
        },
        maps: {
          state: 'DISABLED',
          schedule: 'cron(30 0 * * ? *)',
          lastInvocationDate: '2022-03-04 11:03'
        },
        kumostudy: {
          lastInvocationDate: '2022-12-14 12:43'
        },
        collibra: {
          lastInvocationDate: '2023-06-29 01:00'
        },
        impact: {
          state: 'DISABLED',
          schedule: 'cron(30 0 * * ? *)',
          lastInvocationDate: '2023-06-28 14:51'
        }
      };
      return of(result).pipe(
        map((res: OverallStatisticsRawDto) => {
          return Object.entries(res).reduce(
            (overallStatisticsList, [key, value]) => {
              let singleCrawlerStatistic: OverallStatisticsDto = {
                crawlerName: key,
                status: value.state ?? ' - ',
                schedule: value.schedule
                  ? cronstrue.toString(
                      value.schedule.replace(/[cron\(\)]+/g, '')
                    )
                  : ' - ',
                lastRunDate: value.lastInvocationDate
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
                status: value.state ?? ' - ',
                schedule: value.schedule
                  ? cronstrue.toString(
                      value.schedule.replace(/[cron\(\)]+/g, '')
                    )
                  : ' - ',
                lastRunDate: value.lastInvocationDate
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
      fromObject: queryParams
    });
    const headers = new HttpHeaders({
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJkYzJlM2ZkNS1hYzA5LTRhMTUtOWJlMC04MGE5Mzc2ZTNjNjIiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vZmNiMmIzN2ItNWRhMC00NjZiLTliODMtMDAxNGI2N2E3Yzc4L3YyLjAiLCJpYXQiOjE2ODgxMjY2NDgsIm5iZiI6MTY4ODEyNjY0OCwiZXhwIjoxNjg4MTMxOTkwLCJhaW8iOiJBY1FBTy84VEFBQUE3N2xNOVdKNy9FM0Q5UmZoa1dMWmwvamtlS1J3TXpOL01XN1VZNTFOY2hhd3RzcDVCV0kyVkRkRTJxNk1LMjdmUUpiNHdFbXlYNGYwdlFBVy85bVJCNFpHTEYwcTMwdkg1TTlFL0tiNy9venF1OE0vT0V1clhOK2ZHTkJFUjJkWVpaUGJncVpFWHViZjNNUXFacW0rOE4zbEIyaTB2SGJueWJqL0VkdFBlVm9USHFEaFVvQjFJeHUrZlFWbGlSUFRicHRvYUpYc0hNOXF3QjZYTDVucklTTlp6azZhZTFyRVREYVdQc3dET0Fzd1lwYWNTKy91czV6YnBlMWJ2SW8xIiwiYXpwIjoiNTI5NzdkMTItYWE4Ni00MjcxLWJmMWQtODIzYzE3YjhlZDQxIiwiYXpwYWNyIjoiMCIsIm5hbWUiOiJEZW5pcyBHZWlzdCIsIm9pZCI6Ijk4ODIxMTgzLWJmNDctNDY0OC04M2I1LTc3MjE2ODI3Mjk1YSIsInByZWZlcnJlZF91c2VybmFtZSI6ImRlbmlzLmdlaXN0LmV4dEBiYXllci5jb20iLCJyaCI6IjAuQVFzQWU3T3lfS0JkYTBhYmd3QVV0bnA4ZU5VX0x0d0pyQlZLbS1DQXFUZHVQR0lMQUxVLiIsInNjcCI6IlJlYWQuQWxsIiwic3ViIjoicWIteUZtbzktT0w1MzJnTGhLbDRJNi1mdl9aZ0ZhMHVFbmwtZGlWcnpVUSIsInRpZCI6ImZjYjJiMzdiLTVkYTAtNDY2Yi05YjgzLTAwMTRiNjdhN2M3OCIsInV0aSI6IllNRGdsQkNCbWtHRjhJWFp3VVV0QUEiLCJ2ZXIiOiIyLjAifQ.MXvF3iGEvjIcihaAAABu57vXXlmg4w5Jo0s-nKgkVzrG9J3Naaxbtkil3SewFUySY6lERPj-Yzjpnm3YxvIkkv0JgVqnyx9gcVpQfQQ7lMMKDI25Vfx4lUGXPG7q-Qznq1xMAStxgt6gbBe08aW9HAZO7d6URZ4_ePD_Ki1TmXQDhW6UHVNChA-sEE7GHe5MwjzM24mNa41o-fMVJUE-pGjrW5sw0QATwny6L8XBQ-fVvc0gx2kICmb7Vk-2bBunnZemhCzaNolP8Znfye5m3PwirLkS5TR4eAeMq5D1QL9P9CWgJEzC8GZ9aU_ZhvO2vv6hHAPMgCwqUlInX0PngQ'
    });
    return this.httpClient.get(url, { params, headers });
  }
}
