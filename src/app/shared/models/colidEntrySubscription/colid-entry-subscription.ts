export class ColidEntrySubscription {
  label: string;
  definition: string;
  resourceType: string;
  lifecycleStatus: string;
  isSubscribed: boolean = true;

  public constructor(label, definition, resourceType, lifecycleStatus) {
    this.label = label;
    this.definition = definition;
    this.resourceType = resourceType;
    this.lifecycleStatus = lifecycleStatus;
  }
}
