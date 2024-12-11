import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { PropertyStatistics } from 'src/app/shared/models/statistics/property-statistics';
import { PropertyCharacteristic as PropertyCharacteristic } from 'src/app/shared/models/statistics/property-characteristic.mode';
import {
  FetchResourceStatistics,
  ResetResourceStatistics,
  StatisticsState
} from 'src/app/states/statistics.state';
import { ChartData } from 'src/app/shared/models/chart/chart-data';

@Component({
  selector: 'app-system-analytics',
  templateUrl: './system-analytics.component.html',
  styleUrls: ['./system-analytics.component.scss']
})
export class SystemAnalyticsComponent implements OnInit, OnDestroy {
  @Select(StatisticsState.getTotalNumberOfResources)
  totalNumberOfResources$: Observable<number>;

  @Select(StatisticsState.getNumberOfProperties)
  numberOfProperties$: Observable<PropertyStatistics>;

  @Select(StatisticsState.getLabelLengthStatistic)
  labelLengthStatistic$: Observable<PropertyStatistics>;
  @Select(StatisticsState.getDefinitionLengthStatistic)
  definitionLengthStatistic$: Observable<PropertyStatistics>;

  @Select(StatisticsState.getNumberOfVersionsOfResources)
  numberOfVersionsOfResources$: Observable<PropertyStatistics>;

  @Select(StatisticsState.getNumberOfLinksOfResource)
  numberOfLinksOfResource$: Observable<PropertyStatistics>;

  @Select(StatisticsState.getResourceTypeCharacteristics)
  resourceTypeCharacteristics$: Observable<PropertyCharacteristic[]>;
  @Select(StatisticsState.getConsumerGroupCharacteristics)
  consumerGroupCharacteristics$: Observable<PropertyCharacteristic[]>;
  @Select(StatisticsState.getInfromationClassificationCharacteristics)
  infromationClassificationCharacteristics$: Observable<
    PropertyCharacteristic[]
  >;
  @Select(StatisticsState.getLifecycleStatusCharacteristics)
  lifecycleStatusCharacteristics$: Observable<PropertyCharacteristic[]>;

  @Select(StatisticsState.getResourceStatisticsLoading)
  loading$: Observable<boolean>;

  public normalizedChartData = new Map<string, ChartData>();
  public graphData = new Map<string, ChartData>();

  numberOfPropertiesData: any;

  numberOfVersionsOfResources: any[];

  public barChartType = 'bar';

  resourceTypeCharacteristics: ChartData;
  resourceTypeCharacteristicsSubscription: Subscription;

  consumerGroupCharacteristics: ChartData;
  consumerGroupCharacteristicsSubscription: Subscription;

  informationClassificationCharacteristics: ChartData;
  informationClassificationCharacteristicsSubscription: Subscription;

  lifecycleStatusCharacteristics: ChartData;
  lifecycleStatusCharacteristicsSubscription: Subscription;

  numberOfPropertiesSubscription: Subscription;
  labelLengthStatisticSubscription: Subscription;
  definitionLengthStatisticSubscription: Subscription;
  numberOfVersionsOfResourcesSubscription: Subscription;
  numberOfLinksOfResourceSubscription: Subscription;

  constructor(private store: Store) {}

  ngOnInit() {
    this.loadData();

    this.numberOfPropertiesSubscription = this.numberOfProperties$.subscribe(
      (propertyStatistics) => {
        this.setStatisticData(
          this.normalizedChartData,
          propertyStatistics,
          'Frequency of use',
          'Property',
          '',
          'bar-horizontal-normalized'
        );
      }
    );

    this.labelLengthStatisticSubscription =
      this.labelLengthStatistic$.subscribe((propertyStatistics) => {
        this.setStatisticData(
          this.graphData,
          propertyStatistics,
          'Number of words',
          'Number of entries',
          '',
          'bar-vertical'
        );
      });

    this.definitionLengthStatisticSubscription =
      this.definitionLengthStatistic$.subscribe((propertyStatistics) => {
        this.setStatisticData(
          this.graphData,
          propertyStatistics,
          'Number of words',
          'Number of entries',
          '',
          'bar-vertical'
        );
      });
    this.numberOfVersionsOfResourcesSubscription =
      this.numberOfVersionsOfResources$.subscribe((propertyStatistics) => {
        this.setStatisticData(
          this.graphData,
          propertyStatistics,
          'Number of versionings',
          'Number of entries',
          '',
          'bar-vertical'
        );
      });

    this.numberOfLinksOfResourceSubscription =
      this.numberOfLinksOfResource$.subscribe((propertyStatistics) => {
        if (propertyStatistics != null) {
          propertyStatistics.name = 'Links of resources';
        }
        this.setStatisticData(
          this.graphData,
          propertyStatistics,
          'Number of links',
          'Number of entries',
          '',
          'bar-vertical'
        );
      });

    this.resourceTypeCharacteristicsSubscription =
      this.resourceTypeCharacteristics$.subscribe((typeCharacteristics) => {
        if (typeCharacteristics != null) {
          this.setResourceTypeCharacteristics(typeCharacteristics);
        }
      });

    this.consumerGroupCharacteristicsSubscription =
      this.consumerGroupCharacteristics$.subscribe((cgCharacteristics) => {
        if (cgCharacteristics != null) {
          this.setConsumerGroupCharacteristics(cgCharacteristics);
        }
      });

    this.informationClassificationCharacteristicsSubscription =
      this.infromationClassificationCharacteristics$.subscribe(
        (icCharacteristics) => {
          if (icCharacteristics != null) {
            this.setInformationClassificationCharacteristics(icCharacteristics);
          }
        }
      );

    this.lifecycleStatusCharacteristicsSubscription =
      this.lifecycleStatusCharacteristics$.subscribe((lsCharacteristics) => {
        if (lsCharacteristics != null) {
          this.setLifecycleStatusCharacteristics(lsCharacteristics);
        }
      });
  }

  ngOnDestroy() {
    this.numberOfPropertiesSubscription.unsubscribe();
    this.labelLengthStatisticSubscription.unsubscribe();
    this.definitionLengthStatisticSubscription.unsubscribe();
    this.numberOfVersionsOfResourcesSubscription.unsubscribe();
    this.numberOfLinksOfResourceSubscription.unsubscribe();
    this.resourceTypeCharacteristicsSubscription.unsubscribe();
    this.consumerGroupCharacteristicsSubscription.unsubscribe();
    this.informationClassificationCharacteristicsSubscription.unsubscribe();
    this.lifecycleStatusCharacteristicsSubscription.unsubscribe();
    this.store.dispatch(new ResetResourceStatistics()).subscribe();
  }

  setResourceTypeCharacteristics(
    propertyCharacteristics: PropertyCharacteristic[]
  ) {
    const chartData = new ChartData();
    chartData.xLabel = 'Resource Types';
    chartData.yLabel = 'Number of entries';
    chartData.name = 'Resource Type Characteristics';
    chartData.description = 'Some description';
    chartData.initalChart = 'bar-vertical';
    chartData.data = propertyCharacteristics.map((res) => {
      return { name: res.name, value: res.count };
    });

    this.resourceTypeCharacteristics = chartData;
  }

  setConsumerGroupCharacteristics(
    propertyCharacteristics: PropertyCharacteristic[]
  ) {
    const chartData = new ChartData();
    chartData.xLabel = 'Consumer Groups';
    chartData.yLabel = 'Number of entries';
    chartData.name = 'Consumer Group Characteristics';
    chartData.description = 'Some description';
    chartData.initalChart = 'bar-vertical';
    chartData.data = propertyCharacteristics.map((res) => {
      return { name: res.name, value: res.count };
    });

    this.consumerGroupCharacteristics = chartData;
  }

  setInformationClassificationCharacteristics(
    propertyCharacteristics: PropertyCharacteristic[]
  ) {
    const chartData = new ChartData();
    chartData.xLabel = 'Information Classifications';
    chartData.yLabel = 'Number of entries';
    chartData.name = 'Information Classification Characteristics';
    chartData.description = 'Some description';
    chartData.initalChart = 'bar-vertical';
    chartData.data = propertyCharacteristics.map((res) => {
      return { name: res.name, value: res.count };
    });

    this.informationClassificationCharacteristics = chartData;
  }

  setLifecycleStatusCharacteristics(
    propertyCharacteristics: PropertyCharacteristic[]
  ) {
    const chartData = new ChartData();
    chartData.xLabel = 'Lifecycle Status';
    chartData.yLabel = 'Number of entries';
    chartData.name = 'Lifecycle Status Characteristics';
    chartData.description = 'Some description';
    chartData.initalChart = 'bar-vertical';
    chartData.data = propertyCharacteristics.map((res) => {
      return { name: res.name, value: res.count };
    });

    this.lifecycleStatusCharacteristics = chartData;
  }

  setStatisticData(
    charts: Map<string, ChartData>,
    propertyStatistics: PropertyStatistics,
    xLabel: string,
    yLabel: string,
    description: string,
    initialChart:
      | 'pie'
      | 'line-chart'
      | 'bar-vertical'
      | 'bar-horizontal-normalized'
  ) {
    if (propertyStatistics != null) {
      let chartData = new ChartData();
      chartData.xLabel = xLabel;
      chartData.yLabel = yLabel;
      chartData.name = propertyStatistics.name;
      chartData.description = description;
      chartData.initalChart = initialChart;
      chartData.data = [];

      const increment = propertyStatistics.increment;

      if (initialChart === 'line-chart') {
        const obj = { name: propertyStatistics.name, series: [] };
        propertyStatistics.counts.forEach((item) => {
          obj.series.push({ name: `${item.key}`, value: item.value });
        });
        chartData.data = [obj];

        charts.set(propertyStatistics.name, chartData);
      }

      if (initialChart === 'bar-vertical') {
        charts.set(propertyStatistics.name, chartData);
        for (const part of propertyStatistics.counts) {
          charts.get(propertyStatistics.name).data.push({
            name: this.getChartName(part.key, increment),
            value: part.value
          });
        }
      }

      if (initialChart === 'pie') {
        charts.set(propertyStatistics.name, chartData);
        for (const part of propertyStatistics.counts) {
          charts.get(propertyStatistics.name).data.push({
            name: this.getChartName(part.key, increment),
            value: part.value
          });
        }
      }

      if (initialChart === 'bar-horizontal-normalized') {
        this.totalNumberOfResources$.subscribe((total) => {
          if (total != null) {
            const chartData = new ChartData();
            chartData.xLabel = xLabel;
            chartData.yLabel = yLabel;
            chartData.name = propertyStatistics.name;
            chartData.description = description;
            chartData.initalChart = initialChart;
            chartData.data = [];

            charts.set(propertyStatistics.name, chartData);
            for (const part of propertyStatistics.counts) {
              charts.get(propertyStatistics.name).data.push({
                name: this.getChartName(part.key, increment),
                series: [
                  {
                    name: 'Has Property',
                    value: +part.value
                  },
                  {
                    name: 'Without Property',
                    value: +part.total - +part.value
                  }
                ]
              });
            }
          }
        });
      }
    }
  }

  getChartName(key: string, increment: number): string {
    return increment == null || increment === 0
      ? key
      : `${+key - increment} - ${key}`;
  }

  loadData() {
    this.store.dispatch(new FetchResourceStatistics()).subscribe();
  }
}
