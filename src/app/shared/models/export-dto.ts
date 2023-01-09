export interface ExportDto{
  includeHeader: boolean;
  exportContent: string;
  readableValues: string;
  exportFormat: string;
}

export const defaultExportSettings: ExportDto = {
  includeHeader: true,
  exportContent: "uriAndMeta",
  readableValues: "clearText",
  exportFormat: "excelTemplate",
};
