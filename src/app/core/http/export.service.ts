import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExcelExportPayload } from 'src/app/shared/models/export/excel-export-payload';
import { ExportSettings } from 'src/app/shared/models/export/export-settings';
import { SearchRequest } from 'src/app/shared/models/export/search-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private httpClient: HttpClient) {}

  startExcelExport(requestBody: ExcelExportPayload) {
    const url = environment.colidApiUrl + '/export';
    return this.httpClient.post<any>(url, requestBody);
  }

  getExportResultsPayload(
    exportSettings: ExportSettings,
    route: ActivatedRoute
  ): ExcelExportPayload {
    const queryParams = route.snapshot.queryParams;

    const searchRequestObject: SearchRequest = {
      from: 0,
      size: 0,
      searchTerm: queryParams['q'],
      aggregationFilters:
        queryParams['f'] == null ? {} : JSON.parse(queryParams['f']),
      rangeFilters:
        queryParams['r'] == null ? {} : JSON.parse(queryParams['r']),
      enableHighlighting: false,
      apiCallTime: new Date().toUTCString()
    };

    const payload: ExcelExportPayload = {
      exportSettings: exportSettings,
      searchRequest: searchRequestObject,
      pidUris: []
    };

    return payload;
  }

  getExportSelectedResultsPayload(
    exportSettings: ExportSettings,
    pidUris: string[]
  ): ExcelExportPayload {
    const payload: ExcelExportPayload = {
      exportSettings,
      searchRequest: null,
      pidUris
    };

    return payload;
  }
}
