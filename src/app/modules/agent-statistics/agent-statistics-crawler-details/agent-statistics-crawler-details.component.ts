import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject, EMPTY, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AgentStatisticsApiService } from 'src/app/core/http/agent-statistics.api.service';
import { DetailedStatisticsRawDto } from 'src/app/shared/models/agent-statistics/DetailedStatisticsRawDto';

@Component({
  selector: 'app-agent-statistics-crawler-details',
  templateUrl: './agent-statistics-crawler-details.component.html',
  styleUrls: ['./agent-statistics-crawler-details.component.css']
})
export class AgentStatisticsCrawlerDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('chartContainer') chartContainer: ElementRef;
  crawlerName: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
  masterSub: Subscription = new Subscription();
  selectedDatesSubject$: BehaviorSubject<{
    startDate: string;
    endDate: string;
  }>;

  errorFetchingStatistics: boolean = false;
  loading: boolean = true;

  chartHeight = 0;
  chartWidth = 0;

  endDateFilter = this.checkForValidDate.bind(this);

  xAxisTicks = ['2023-06-17', '2023-06-19', '2023-06-21', '2023-06-23'];

  dataItemsCrawled = [];

  dataItemsUpdate = [];

  dataCrawlerDurationSum = [];

  dataCrawlerDurationAverage = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private agentStatisticsApiService: AgentStatisticsApiService
  ) {}

  ngOnInit(): void {
    this.crawlerName = this.route.snapshot.queryParams['crawlerName'];
    let startDateString = this.route.snapshot.queryParams['startDate'];
    let endDateString = this.route.snapshot.queryParams['endDate'];
    this.startDate = moment(startDateString);
    this.endDate = moment(endDateString);
    this.selectedDatesSubject$ = new BehaviorSubject({
      startDate: this.startDate.format('YYYY-MM-DD'),
      endDate: this.endDate.clone().add(1, 'd').format('YYYY-MM-DD')
    });
    this.masterSub.add(
      this.selectedDatesSubject$
        .pipe(
          switchMap((selectedDate) => {
            this.loading = true;
            return this.agentStatisticsApiService
              .getDetailedStatistics({
                crawlerName: this.crawlerName,
                startDate: selectedDate.startDate,
                endDate: selectedDate.endDate
              })
              .pipe(
                catchError((_) => {
                  this.loading = false;
                  this.errorFetchingStatistics = true;
                  return EMPTY;
                })
              );
          })
        )
        .subscribe((res: DetailedStatisticsRawDto) => {
          this.errorFetchingStatistics = false;
          this.dataItemsCrawled =
            res.crawlerDurationSum.length > 0
              ? [
                  {
                    name: 'Items crawled',
                    series: res.itemsCrawled.map((datapoint) => ({
                      name: datapoint.date.slice(0, 10),
                      value: datapoint.itemsCrawled
                    }))
                  }
                ]
              : [];

          this.dataCrawlerDurationSum =
            res.crawlerDurationSum.length > 0
              ? [
                  {
                    name: 'Crawler duration sum',
                    series: res.crawlerDurationSum.map((datapoint) => ({
                      name: datapoint.date.slice(0, 10),
                      value: datapoint.duration
                    }))
                  }
                ]
              : [];

          this.dataCrawlerDurationAverage =
            res.crawlerDurationAverage.length > 0
              ? [
                  {
                    name: 'Crawler duration average',
                    series: res.crawlerDurationSum.map((datapoint) => ({
                      name: datapoint.date.slice(0, 10),
                      value: datapoint.duration
                    }))
                  }
                ]
              : [];

          this.dataItemsUpdate =
            res.itemsToUpdate.length > 0
              ? [
                  {
                    name: 'Items to update',
                    series: res.itemsToUpdate.map((datapoint) => ({
                      name: datapoint.date.slice(0, 10),
                      value: datapoint.itemsToUpdate
                    }))
                  }
                ]
              : [];

          if (res.itemsUpdated.length > 0) {
            this.dataItemsUpdate.push({
              name: 'Items updated',
              series: res.itemsUpdated.map((datapoint) => ({
                name: datapoint.date.slice(0, 10),
                value: datapoint.itemsUpdated
              }))
            });
          }

          this.loading = false;
        })
    );
  }

  ngAfterViewInit() {
    this.chartHeight = this.chartContainer.nativeElement.offsetHeight / 2;
    this.chartWidth = this.chartContainer.nativeElement.offsetWidth / 2;
  }

  ngOnDestroy(): void {
    this.masterSub.unsubscribe();
  }

  filterDateSelected(
    event: MatDatepickerInputEvent<moment.Moment>,
    isStartDate: boolean
  ) {
    if (isStartDate) {
      this.startDate = event.value;
    } else {
      this.endDate = event.value;
    }
    const url = this.router
      .createUrlTree([], {
        queryParams: {
          crawlerName: this.crawlerName,
          startDate: this.startDate.format('YYYY-MM-DD'),
          endDate: this.endDate.format('YYYY-MM-DD')
        },
        relativeTo: this.route
      })
      .toString();
    this.location.go(url);
    this.selectedDatesSubject$.next({
      startDate: this.startDate.format('YYYY-MM-DD'),
      endDate: this.endDate.clone().add(1, 'd').format('YYYY-MM-DD')
    });
  }

  checkForValidDate(date: moment.Moment) {
    return date.valueOf() > this.startDate?.valueOf();
  }
}
