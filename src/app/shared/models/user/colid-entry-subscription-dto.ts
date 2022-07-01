export class ColidEntrySubscriptionDto {
  id: number;
  colidPidUri: string;
  note: string;
  subscriptions:number;

  public constructor(colidPidUri: string, subscriptions?:number) {
      this.colidPidUri = colidPidUri;
      this.subscriptions=subscriptions;
  }
}
