export class ColidEntrySubscriptionDto {
  id: number;
  colidPidUri: string;
  note: string;

  public constructor(colidPidUri: string) {
      this.colidPidUri = colidPidUri;
  }
}
