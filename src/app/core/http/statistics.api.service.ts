import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PropertyStatistics } from '../../shared/models/statistics/property-statistics';
import { PropertyCharacteristic } from 'src/app/shared/models/statistics/property-characteristic.mode';

@Injectable({
  providedIn: 'root'
})
export class StatisticsApiService {
  constructor(private httpClient: HttpClient) {}

  getTotalNumberOfResources(): Observable<number> {
    const url = environment.reportingApiUrl + '/statistics/resource/total';

    return this.httpClient.get<number>(url);
  }

  getNumberOfControlledVocabularySelection(
    property: string
  ): Observable<PropertyStatistics> {
    const url =
      environment.reportingApiUrl +
      '/statistics/resource/controlledvocabularyselection';

    let params = new HttpParams();
    params = params.append('property', property);
    return this.httpClient.get<PropertyStatistics>(url, { params });
  }

  getNumberOfProperties(): Observable<PropertyStatistics> {
    const url =
      environment.reportingApiUrl + '/statistics/resource/numberofproperties';

    return this.httpClient.get<PropertyStatistics>(url);
  }

  getNumberOfResourcesInRelationToPropertyLength(
    property: string,
    increment: number
  ): Observable<PropertyStatistics> {
    const url =
      environment.reportingApiUrl +
      '/statistics/resource/numberofresourcesinrelationtopropertylength';

    let params = new HttpParams();
    params = params.append('property', property);
    params = params.append('increment', increment.toString());
    return this.httpClient.get<PropertyStatistics>(url, { params });
  }

  getNumberOfVersionsOfResources(
    increment: number
  ): Observable<PropertyStatistics> {
    const url =
      environment.reportingApiUrl +
      '/statistics/resource/numberofversionsofresources';

    let params = new HttpParams();
    params = params.append('increment', increment.toString());

    return this.httpClient.get<PropertyStatistics>(url, { params });
  }

  getNumberOfPropertyUsageByGroupOfResource(
    group: string
  ): Observable<PropertyStatistics> {
    const url =
      environment.reportingApiUrl +
      '/statistics/resource/numberofpropertyusagebygroup';

    let params = new HttpParams();
    params = params.append('group', group);

    return this.httpClient.get<PropertyStatistics>(url, { params });
  }

  getResourceTypeCharacteristics(): Observable<PropertyCharacteristic[]> {
    const url =
      environment.reportingApiUrl + '/statistics/resource/characteristics/type';
    return this.httpClient.get<PropertyCharacteristic[]>(url);
  }

  getConsumerGroupCharacteristics(): Observable<PropertyCharacteristic[]> {
    const url =
      environment.reportingApiUrl +
      '/statistics/resource/characteristics/consumergroup';
    return this.httpClient.get<PropertyCharacteristic[]>(url);
  }

  getInformationClassificationCharacteristics(): Observable<
    PropertyCharacteristic[]
  > {
    const url =
      environment.reportingApiUrl +
      '/statistics/resource/characteristics/informationclassification';
    return this.httpClient.get<PropertyCharacteristic[]>(url);
  }

  getLifecycleStatusCharacteristics(): Observable<PropertyCharacteristic[]> {
    const url =
      environment.reportingApiUrl +
      '/statistics/resource/characteristics/lifecyclestatus';
    return this.httpClient.get<PropertyCharacteristic[]>(url);
  }
}
