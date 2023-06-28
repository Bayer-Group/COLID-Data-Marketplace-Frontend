import { Constants } from "src/app/shared/constants";
import { Entity } from "../entities/entity";
import { MetaDataProperty } from "../metadata/meta-data-property";
import { VersionProperty } from "./version-property";
export class HistoricResourceOverviewDTO {
  id: string;
  pidUri: string;
  lastChangeDateTime: string;
  lastChangeUser: string;
  lifeCycleStatus: string = Constants.Resource.LifeCycleStatus.Historic;
}
export class ResourceRevisionHistory {
  name: string;
  additionals: object;
  removals: object;
}

export class ResourceRevisionHistoryUI {
  metadata: ResourceRevisionHistoryParams<MetaDataProperty[]>;
  entity: ResourceRevisionHistoryParams<Entity>;
  entityVersions: ResourceRevisionHistoryParams<VersionProperty[]>;
}

export class ResourceRevisionHistoryParams<T> {
  additions: T;
  removals: T;
}
