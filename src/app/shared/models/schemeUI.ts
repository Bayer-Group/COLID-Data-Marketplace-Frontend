import { Constants } from "src/app/shared/constants";

export class SchemeUiResult {
  columns: any[];
  tables: any[];
}

export class Filed {
  resourceId: string;
  pidURI: string;
}

export class TableFiled extends Filed {
  linkedTableFiled: Filed[];
}

export class SchemeUi {
  columns: Filed[];
  tables: TableFiled[];
}

export class SchemaUIResult {
  columns: any[];
  tables: any[];
}

export const Schema_Support = {
  Dataset: Constants.ResourceTypes.Dataset,
  Table: Constants.ResourceTypes.Table,
  Column: Constants.ResourceTypes.Column,
  Subset: Constants.OWL.SubClass,
};
