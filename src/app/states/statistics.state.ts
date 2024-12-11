import { Selector, State, StateContext, Action } from '@ngxs/store';
import { StatisticsApiService } from '../core/http/statistics.api.service';
import { Constants } from 'src/app/shared/constants';
import { PropertyStatistics } from '../shared/models/statistics/property-statistics';
import { PropertyCharacteristic } from '../shared/models/statistics/property-characteristic.mode';
import { Injectable } from '@angular/core';

export class FetchResourceStatistics {
  static readonly type = '[ResourceStatistics] Fetch resourceStatistics';
  constructor() {}
}

export class ResetResourceStatistics {
  static readonly type = '[ResourceStatistics] Reset resourceStatistics';
  constructor() {}
}

export class StatisticsStateModel {
  loading: boolean;
  totalNumberOfResources: number;
  numberOfProperties: PropertyStatistics;
  definitionLengthStatistic: PropertyStatistics;
  labelLengthStatistic: PropertyStatistics;
  numberOfVersionsOfResources: PropertyStatistics;
  numberOfLinksOfResource: PropertyStatistics;
  resourceTypeCharacteristics: PropertyCharacteristic[];
  consumerGroupCharacteristics: PropertyCharacteristic[];
  infromationClassificationCharacteristics: PropertyCharacteristic[];
  lifecycleStatusCharacteristics: PropertyCharacteristic[];
}

@State<StatisticsStateModel>({
  name: 'Statistics',
  defaults: {
    loading: false,
    totalNumberOfResources: null,
    numberOfProperties: null,
    definitionLengthStatistic: null,
    labelLengthStatistic: null,
    numberOfVersionsOfResources: null,
    numberOfLinksOfResource: null,
    resourceTypeCharacteristics: null,
    consumerGroupCharacteristics: null,
    infromationClassificationCharacteristics: null,
    lifecycleStatusCharacteristics: null
  }
})
@Injectable()
export class StatisticsState {
  constructor(private statisticsApiService: StatisticsApiService) {}

  @Selector()
  public static getTotalNumberOfResources(state: StatisticsStateModel) {
    return state.totalNumberOfResources;
  }

  @Selector()
  public static getNumberOfProperties(state: StatisticsStateModel) {
    return state.numberOfProperties;
  }

  @Selector()
  public static getDefinitionLengthStatistic(state: StatisticsStateModel) {
    return state.definitionLengthStatistic;
  }

  @Selector()
  public static getLabelLengthStatistic(state: StatisticsStateModel) {
    return state.labelLengthStatistic;
  }

  @Selector()
  public static getNumberOfVersionsOfResources(state: StatisticsStateModel) {
    return state.numberOfVersionsOfResources;
  }

  @Selector()
  public static getNumberOfLinksOfResource(state: StatisticsStateModel) {
    return state.numberOfLinksOfResource;
  }

  @Selector()
  public static getResourceTypeCharacteristics(state: StatisticsStateModel) {
    return state.resourceTypeCharacteristics;
  }

  @Selector()
  public static getConsumerGroupCharacteristics(state: StatisticsStateModel) {
    return state.consumerGroupCharacteristics;
  }

  @Selector()
  public static getInfromationClassificationCharacteristics(
    state: StatisticsStateModel
  ) {
    return state.infromationClassificationCharacteristics;
  }

  @Selector()
  public static getResourceStatisticsLoading(state: StatisticsStateModel) {
    return state.loading;
  }

  @Selector()
  public static getLifecycleStatusCharacteristics(state: StatisticsStateModel) {
    return state.lifecycleStatusCharacteristics;
  }

  @Action(ResetResourceStatistics)
  ResethResourceStatistics(
    { patchState }: StateContext<StatisticsStateModel>,
    {}: ResetResourceStatistics
  ) {
    patchState({
      totalNumberOfResources: null,
      numberOfProperties: null,
      definitionLengthStatistic: null,
      labelLengthStatistic: null,
      numberOfVersionsOfResources: null,
      numberOfLinksOfResource: null,
      resourceTypeCharacteristics: null,
      consumerGroupCharacteristics: null,
      infromationClassificationCharacteristics: null,
      lifecycleStatusCharacteristics: null,
      loading: false
    });
  }

  @Action(FetchResourceStatistics)
  FetchResourceStatistics(
    { patchState }: StateContext<StatisticsStateModel>,
    {}: FetchResourceStatistics
  ) {
    this.statisticsApiService.getTotalNumberOfResources().subscribe((value) => {
      patchState({
        totalNumberOfResources: value
      });
    });

    this.statisticsApiService.getNumberOfProperties().subscribe((value) => {
      patchState({
        numberOfProperties: value
      });
    });

    this.statisticsApiService
      .getNumberOfResourcesInRelationToPropertyLength(
        Constants.Metadata.HasLabel,
        5
      )
      .subscribe((value) => {
        patchState({
          labelLengthStatistic: value
        });
      });

    this.statisticsApiService
      .getNumberOfResourcesInRelationToPropertyLength(
        Constants.Metadata.HasResourceDefinition,
        10
      )
      .subscribe((value) => {
        patchState({
          definitionLengthStatistic: value
        });
      });

    this.statisticsApiService
      .getNumberOfVersionsOfResources(1)
      .subscribe((value) => {
        patchState({
          numberOfVersionsOfResources: value
        });
      });

    this.statisticsApiService
      .getNumberOfPropertyUsageByGroupOfResource(
        Constants.Resource.Groups.LinkTypes
      )
      .subscribe((value) => {
        patchState({
          numberOfLinksOfResource: value
        });
      });

    this.statisticsApiService
      .getResourceTypeCharacteristics()
      .subscribe((value) => {
        patchState({
          resourceTypeCharacteristics: value
        });
      });

    this.statisticsApiService
      .getConsumerGroupCharacteristics()
      .subscribe((value) => {
        patchState({
          consumerGroupCharacteristics: value
        });
      });

    this.statisticsApiService
      .getInformationClassificationCharacteristics()
      .subscribe((value) => {
        patchState({
          infromationClassificationCharacteristics: value
        });
      });

    this.statisticsApiService
      .getLifecycleStatusCharacteristics()
      .subscribe((value) => {
        patchState({
          lifecycleStatusCharacteristics: value
        });
      });
  }
}
