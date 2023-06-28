export class policyRequest {
  pidUri: string;
  dataCategories: string[];
  countryContext: string[];

  constructor(
    pidUri: string,
    datacategories: string[],
    countryContext: string[]
  ) {
    this.pidUri = pidUri;
    this.dataCategories = datacategories;
    this.countryContext = countryContext;
  }
}
