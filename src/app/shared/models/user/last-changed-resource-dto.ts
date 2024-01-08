export interface UserLastChangedResource {
  resourcePidUri: string;
  resourceLabel: string;
  resourceDefinition: string;
  resourceType: string;
  lifeCycleStatus: string;
  resourceLinkedLifeCycleStatus: string | null;
}

export interface UserLastChangedResources {
  total: number;
  changedResources: UserLastChangedResource[];
}
