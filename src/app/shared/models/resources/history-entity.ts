import { MetaDataProperty } from "../metadata/meta-data-property";

export interface HistoryEntityDirection {
    metadata: Array<MetaDataProperty>;
    entity: any;
    entityVersion: any;
}

export interface HistoryEntity {
  additions: HistoryEntityDirection;
  removals: HistoryEntityDirection;
  lastChangedByDateTime: string;
  lastChangeUser: string;
}