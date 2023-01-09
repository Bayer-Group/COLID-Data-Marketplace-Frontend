export class EntityBase {
  properties: { [id: string]: any[] };

  constructor() {
    this.properties = {};
  }
}
