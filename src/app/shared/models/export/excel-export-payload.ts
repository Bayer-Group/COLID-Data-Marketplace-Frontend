import { ExportSettings } from './export-settings';
import { SearchRequest } from './search-request';

export interface ExcelExportPayload {
    exportSettings: ExportSettings;
    searchRequest?: SearchRequest;
    pidUris?: string[]
}