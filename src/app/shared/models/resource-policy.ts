export class ResourcePolicy {
  id: string;
  policyField1: string;
  policyField2: string;
  name: string;

  constructor(
    id: string,
    policyField1: string,
    policyField2: string,
    name: string
  ) {
    this.id = id;
    this.policyField1 = policyField1;
    this.policyField2 = policyField2;
    this.name = name;
  }
}
